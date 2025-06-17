# 📝 Translation Service Monorepo

Este projeto é um sistema de tradução de textos assíncrono, estruturado em monorepo, utilizando Node.js, TypeScript, Express, Sequelize, RabbitMQ e PostgreSQL. Ele é composto por três principais serviços:

- **API**: Recebe requisições de tradução e as coloca em uma fila.
- **Worker**: Consome as requisições da fila, processa a tradução e atualiza o banco.
- **Common**: Pacote compartilhado com models, utilitários e integrações.

---

## 🚀 Tecnologias Utilizadas

- **Node.js** 22.x
- **TypeScript**
- **Express**
- **Sequelize** (ORM)
- **PostgreSQL**
- **RabbitMQ**
- **Docker & Docker Compose**
- **Swagger (OpenAPI)**
- **Jest** (testes)

---

## 📦 Estrutura do Projeto

```
app-traducao/
├── docker-compose.yml
├── package.json
├── packages/
│   ├── common/
│   │   ├── src/
│   │   └── package.json
│   ├── translation-api/
│   │   ├── src/
│   │   └── package.json
│   └── translation-worker/
│       ├── src/
│       └── package.json
└── ...
```

---

## ⚙️ Como rodar localmente

### 1. Pré-requisitos

- [Docker](https://www.docker.com/)
- [Docker Compose](https://docs.docker.com/compose/)
- [Node.js](https://nodejs.org/) (opcional, para desenvolvimento local)

### 2. Subindo tudo com Docker Compose

```sh
docker-compose up --build
```

- Acesse a API em: [http://localhost:3000](http://localhost:3000)
- Acesse o Swagger (documentação): [http://localhost:3000/api-docs](http://localhost:3000/api-docs)
- Acesse o RabbitMQ Management: [http://localhost:15672](http://localhost:15672)  
  Usuário: `user` &nbsp; Senha: `password`

### 3. Rodando testes

```sh
npm install
npm test
```

---

## 🛠️ Principais Endpoints

### `POST /translations`

Cria uma nova requisição de tradução.

**Exemplo de requisição:**
```json
{
  "originalText": "Hello, world!",
  "sourceLanguage": "en",
  "targetLanguage": "pt"
}
```

**Resposta:**
```json
{
  "message": "Requisição de tradução recebida e está na fila para processamento.",
  "requestId": "uuid-gerado"
}
```

---

### `GET /translations/{requestId}`

Consulta o status e o resultado de uma tradução.

**Resposta de sucesso:**
```json
{
  "id": "uuid-gerado",
  "status": "completed",
  "originalText": "Hello, world!",
  "sourceLanguage": "en",
  "targetLanguage": "pt",
  "translatedText": "Olá, mundo!",
  "createdAt": "...",
  "updatedAt": "..."
}
```

---

## 📝 Documentação da API

Acesse a documentação interativa em [http://localhost:3000/api-docs](http://localhost:3000/api-docs).

---

## 🐇 Arquitetura Assíncrona

- A API recebe requisições e publica mensagens no RabbitMQ.
- O Worker consome
