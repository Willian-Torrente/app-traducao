"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const sequelize_1 = require("sequelize");
const Translation_1 = __importDefault(require("../../common/dist/models/Translation"));
// Crie uma instância do Sequelize para Postgres
const sequelize = new sequelize_1.Sequelize(process.env.DB_NAME || "nome_do_banco", process.env.DB_USER || "usuario", process.env.DB_PASSWORD || "senha", {
    host: process.env.DB_HOST || "localhost",
    port: Number(process.env.DB_PORT) || 5432,
    dialect: "postgres",
    logging: false,
});
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
        const newTranslation = await Translation_1.default.create({ originalText, sourceLanguage, targetLanguage }, { returning: true });
        const requestId = newTranslation.id;
        console.log(`[API] Requisição de tradução ${requestId} criada. Deveria ser enviada para a fila.`);
        return res.status(202).json({
            message: "Requisição de tradução recebida e está na fila para processamento.",
            requestId: requestId,
        });
    }
    catch (error) {
        console.error("[API] Erro ao criar a requisição de tradução:", error);
        return res.status(500).json({ message: "Erro interno do servidor." });
    }
});
// ========= ROTA DE CONSULTA DE STATUS =========
app.get("/translations/:requestId", (req, res) => {
    const { requestId } = req.params;
    return res.send(`A ser implementado: Status para a requisição ${requestId}`);
});
// Inicia o servidor
app.listen(port, async () => {
    console.log(`✅ Translation API escutando na porta ${port}`);
    try {
        await sequelize.authenticate();
        console.log("✅ Conexão com o banco de dados estabelecida.");
        await sequelize.sync();
    }
    catch (error) {
        console.error("Não foi possível conectar ao Postgres:", error);
    }
});
//# sourceMappingURL=index.js.map