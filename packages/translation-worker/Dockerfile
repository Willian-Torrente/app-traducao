# ESTÁGIO 1: Builder - Constrói todo o projeto
FROM node:22-slim AS builder
WORKDIR /app

# Copia os package.json e o lockfile
COPY package.json package-lock.json ./
COPY packages/common/package.json ./packages/common/
COPY packages/translation-api/package.json ./packages/translation-api/
COPY packages/translation-worker/package.json ./packages/translation-worker/

# Instala todas as dependências
RUN npm ci --legacy-peer-deps

# Copia todo o código fonte
COPY . .

# Executa o build de todos os pacotes
RUN npm run build

# ESTÁGIO 2: Runner - A imagem final, limpa e otimizada
FROM node:22-slim AS runner
WORKDIR /app

# Copia apenas as dependências de PRODUÇÃO
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./
COPY --from=builder /app/packages/common/package.json ./packages/common/
COPY --from=builder /app/packages/translation-worker/package.json ./packages/translation-worker/

# Copia APENAS os arquivos JÁ COMPILADOS do common e do worker
COPY --from=builder /app/packages/common/dist ./packages/common/dist
COPY --from=builder /app/packages/translation-worker/dist ./packages/translation-worker/dist

# Comando final para iniciar o WORKER
CMD ["node", "packages/translation-worker/dist/index.js"]