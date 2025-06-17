"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@app/common");
const express_1 = __importDefault(require("express"));
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const app = (0, express_1.default)();
app.use(express_1.default.json()); // Mova esta linha para cima
// --- Configuração do Swagger ---
const swaggerOptions = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Translation API",
            version: "1.0.0",
            description: "API para solicitar traduções de texto de forma assíncrona.",
        },
        servers: [
            {
                url: `http://localhost:${process.env.PORT || 3000}`,
                description: "Servidor de Desenvolvimento",
            },
        ],
    },
    // O caminho correto relativo à raiz do projeto (/app) no contêiner
    apis: [__filename],
};
const swaggerSpec = (0, swagger_jsdoc_1.default)(swaggerOptions);
app.use("/api-docs", swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swaggerSpec));
// --- Fim da Configuração do Swagger ---
const port = process.env.PORT || 3000;
app.get("/", (req, res) => {
    return res.send("Translation API is running!");
});
/**
 * @swagger
 * /translations:
 *   post:
 *     summary: Cria uma nova requisição de tradução
 *     tags: [Translations]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - originalText
 *               - sourceLanguage
 *               - targetLanguage
 *             properties:
 *               originalText:
 *                 type: string
 *                 example: "Hello, world!"
 *               sourceLanguage:
 *                 type: string
 *                 example: "en"
 *               targetLanguage:
 *                 type: string
 *                 example: "pt"
 *     responses:
 *       202:
 *         description: Requisição recebida com sucesso para processamento.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 requestId:
 *                   type: string
 *                   format: uuid
 */
app.post("/translations", async (req, res) => {
    try {
        const { originalText, sourceLanguage, targetLanguage } = req.body;
        if (!originalText || !sourceLanguage || !targetLanguage) {
            return res.status(400).json({ message: "Campos obrigatórios ausentes." });
        }
        const newTranslation = await common_1.Translation.create({
            originalText,
            sourceLanguage,
            targetLanguage,
        });
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
/**
 * @swagger
 * /translations/{requestId}:
 *   get:
 *     summary: Consulta o status e o resultado de uma tradução
 *     tags: [Translations]
 *     parameters:
 *       - in: path
 *         name: requestId
 *         schema:
 *           type: string
 *           format: uuid
 *         required: true
 *         description: O ID da requisição de tradução
 *     responses:
 *       200:
 *         description: Sucesso. Retorna o objeto da tradução.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Translation'
 *       404:
 *         description: Tradução não encontrada.
 */
app.get("/translations/:requestId", async (req, res) => {
    try {
        const { requestId } = req.params;
        const translation = await common_1.Translation.findByPk(requestId);
        if (!translation) {
            return res.status(404).json({ message: "Tradução não encontrada." });
        }
        return res.status(200).json(translation);
    }
    catch (error) {
        console.error("[API] Erro ao consultar a tradução:", error);
        return res.status(500).json({ message: "Erro interno do servidor." });
    }
});
/**
 * @swagger
 * components:
 *   schemas:
 *     Translation:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         status:
 *           type: string
 *           enum: [queued, processing, completed, failed]
 *         originalText:
 *           type: string
 *         sourceLanguage:
 *           type: string
 *         targetLanguage:
 *           type: string
 *         translatedText:
 *           type: string
 *           nullable: true
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 */
app.listen(port, async () => {
    try {
        console.log(`✅ Translation API escutando na porta ${port}`);
        await (0, common_1.testConnection)();
        await (0, common_1.initRabbitMQ)();
    }
    catch (error) {
        console.error("❌ Failed to start the API:", error);
        process.exit(1);
    }
});
//# sourceMappingURL=index.js.map