import { testConnection } from '@app/common/src/config/database';

console.log("Translation worker service starting...");

async function startWorker() {
  await testConnection(); // Testa a conexão com o banco de dados
  console.log("Worker started. Waiting for messages...");
  // A lógica para conectar ao RabbitMQ e processar as mensagens virá aqui.
}

startWorker();