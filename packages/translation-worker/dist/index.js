"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@app/common");
const amqplib_1 = __importDefault(require("amqplib"));
const QUEUE_NAME = "translation_requests";
async function processMessage(msg, channel) {
    console.log(`[Worker] Received message: ${msg.content.toString()}`);
    const translationRequest = JSON.parse(msg.content.toString());
    const { id, originalText, targetLanguage } = translationRequest;
    let translation = null;
    try {
        // 1. Encontra a requisição no banco de dados
        translation = await common_1.Translation.findByPk(id);
        if (!translation) {
            throw new Error(`Translation with ID ${id} not found.`);
        }
        // 2. Marca a requisição como "processing"
        translation.status = "processing";
        await translation.save();
        console.log(`[Worker] Status for ${id} updated to 'processing'.`);
        // 3. Simula o trabalho de tradução (ex: esperar 5 segundos)
        await new Promise((resolve) => setTimeout(resolve, 5000));
        // Lógica de tradução mockada: inverte o texto original
        const translatedText = originalText.split("").reverse().join("");
        console.log(`[Worker] Text for ${id} translated to: '${translatedText}'`);
        // 4. Salva o resultado e marca como "completed"
        translation.status = "completed";
        translation.translatedText = translatedText;
        await translation.save();
        console.log(`[Worker] Status for ${id} updated to 'completed'.`);
        // 5. Confirma para o RabbitMQ que a mensagem foi processada com sucesso
        // A mensagem será removida da fila.
        channel.ack(msg);
    }
    catch (error) {
        console.error(`[Worker] Error processing message for translation ID ${id}:`, error);
        // Se deu erro, marca a requisição como "failed" no banco
        if (translation) {
            translation.status = "failed";
            await translation.save();
            console.log(`[Worker] Status for ${id} updated to 'failed'.`);
        }
        // Confirma a mensagem mesmo em caso de erro para não entrar em loop infinito de retentativas
        // Em um sistema real, você poderia usar uma "Dead Letter Queue" para tratar falhas.
        channel.ack(msg);
    }
}
async function startWorker() {
    try {
        // Conecta ao banco de dados
        await common_1.sequelize.authenticate();
        console.log("✅ [Worker] Connection to the database has been established successfully.");
        // Conecta ao RabbitMQ
        const RABBITMQ_URL = process.env.RABBITMQ_URL || "amqp://user:password@rabbitmq:5672";
        const connection = await amqplib_1.default.connect(RABBITMQ_URL);
        const channel = await connection.createChannel();
        console.log("✅ [Worker] Connection to RabbitMQ has been established successfully.");
        // Garante que a fila existe
        await channel.assertQueue(QUEUE_NAME, { durable: true });
        console.log(`[Worker] Waiting for messages in queue: ${QUEUE_NAME}. To exit press CTRL+C`);
        // Começa a consumir mensagens da fila
        channel.consume(QUEUE_NAME, (msg) => {
            if (msg) {
                processMessage(msg, channel);
            }
        }, {
            // 'noAck: false' significa que precisamos confirmar manualmente (com channel.ack)
            // que a mensagem foi processada. Isso garante que se o worker morrer no meio
            // do processo, a mensagem não será perdida.
            noAck: false,
        });
    }
    catch (error) {
        console.error("❌ [Worker] Failed to start:", error);
        process.exit(1);
    }
}
// Inicia o worker
startWorker();
//# sourceMappingURL=index.js.map