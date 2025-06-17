"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = require("@app/common/src/config/database");
console.log("Translation worker service starting...");
async function startWorker() {
    await (0, database_1.testConnection)(); // Testa a conexão com o banco de dados
    console.log("Worker started. Waiting for messages...");
    // A lógica para conectar ao RabbitMQ e processar as mensagens virá aqui.
}
startWorker();
//# sourceMappingURL=testeDb.js.map