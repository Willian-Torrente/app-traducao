# ESTÁGIO 1: Builder - Usando a imagem 'slim' que é mais estável
FROM node:22-slim AS builder

WORKDIR /app

# Copia os arquivos de definição do projeto.
COPY package.json package-lock.json ./
COPY packages/common/package.json ./packages/common/
COPY packages/translation-api/package.json ./packages/translation-api/
COPY packages/translation-worker/package.json ./packages/translation-worker/

# Usa 'npm ci' para uma instalação limpa e determinística
RUN npm ci --legacy-peer-deps

# Copia todo o resto do código-fonte
COPY . .

# Executa o build
RUN npm run build


# ESTÁGIO 2: Runner - Também usando a imagem 'slim'
FROM node:22-slim AS runner

WORKDIR /app

# Copia apenas as dependências de PRODUÇÃO do estágio anterior
COPY --from=builder /app/package.json ./
COPY --from=builder /app/packages/common/package.json ./packages/common/
COPY --from=builder /app/packages/translation-api/package.json ./packages/translation-api/
COPY --from=builder /app/node_modules ./node_modules

# Copia APENAS os arquivos JÁ COMPILADOS
COPY --from=builder /app/packages/common/dist ./packages/common/dist
COPY --from=builder /app/packages/translation-api/dist ./packages/translation-api/dist
COPY --from=builder /app/migrations ./migrations
COPY .sequelizerc ./
COPY config ./config

EXPOSE 3000

CMD ["node", "packages/translation-api/dist/index.js"]