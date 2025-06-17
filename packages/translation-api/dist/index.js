"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
// Importa TUDO do nosso pacote comum, incluindo as novas funções
const common_1 = require("@app/common");
common_1.sequelize.sync();
const app = (0, express_1.default)();
const port = process.env.PORT || 3000;
app.use(express_1.default.json());
// ========= ROTA DE STATUS =========
app.get("/", (req, res) => {
    return res.send("Translation API is running!");
});
// ========= ROTA DE CRIAÇÃO DA TRADUÇÃO =========
app.post("/translations", async (req, res) => {
    try {
        const { originalText, sourceLanguage, targetLanguage } = req.body;
        if (!originalText || !sourceLanguage || !targetLanguage) {
            return res.status(400).json({
                message: "Campos obrigatórios ausentes: originalText, sourceLanguage, targetLanguage",
            });
        }
        const newTranslation = await common_1.Translation.create({ originalText, sourceLanguage, targetLanguage }, { returning: true });
        // AQUI ESTÁ A INTEGRAÇÃO: Publica a mensagem na fila
        const queueName = "translation_requests";
        (0, common_1.publishToQueue)(queueName, JSON.stringify(newTranslation));
        return res.status(202).json({
            message: "Requisição de tradução recebida e está na fila para processamento.",
            requestId: newTranslation.id,
        });
    }
    catch (error) {
        console.error("[API] Erro ao criar a requisição de tradução:", error);
        return res.status(500).json({ message: "Erro interno do servidor." });
    }
});
// ========= ROTA DE CONSULTA DE STATUS - VERSÃO FINAL =========
app.get("/translations/:requestId", async (req, res) => {
    try {
        const { requestId } = req.params;
        // Usa o método findByPk (Find by Primary Key) do Sequelize
        const translation = await common_1.Translation.findByPk(requestId);
        // Se não encontrar nenhum registro com esse ID, retorna 404
        if (!translation) {
            return res.status(404).json({ message: "Tradução não encontrada." });
        }
        // Se encontrar, retorna o objeto completo da tradução com status 200
        return res.status(200).json(translation);
    }
    catch (error) {
        console.error("[API] Erro ao consultar a tradução:", error);
        return res.status(500).json({ message: "Erro interno do servidor." });
    }
});
// INICIALIZAÇÃO ATUALIZADA
app.listen(port, async () => {
    try {
        console.log(`✅ Translation API escutando na porta ${port}`);
        await (0, common_1.testConnection)(); // Conecta ao DB
        await (0, common_1.initRabbitMQ)(); // Conecta ao RabbitMQ
    }
    catch (error) {
        console.error("❌ Failed to start the API:", error);
        process.exit(1);
    }
});
//# sourceMappingURL=index.js.map