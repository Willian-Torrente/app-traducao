import express, { Request, Response } from "express";
// Importa TUDO do nosso pacote comum, incluindo as novas funções
import {
  Translation,
  initRabbitMQ,
  publishToQueue,
  sequelize,
  testConnection,
} from "@app/common";

sequelize.sync();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

// ========= ROTA DE STATUS =========
app.get("/", (req: Request, res: Response) => {
  return res.send("Translation API is running!");
});

// ========= ROTA DE CRIAÇÃO DA TRADUÇÃO =========
app.post("/translations", async (req: Request, res: Response) => {
  try {
    const { originalText, sourceLanguage, targetLanguage } = req.body;

    if (!originalText || !sourceLanguage || !targetLanguage) {
      return res.status(400).json({
        message:
          "Campos obrigatórios ausentes: originalText, sourceLanguage, targetLanguage",
      });
    }

    const newTranslation = await Translation.create(
      { originalText, sourceLanguage, targetLanguage },
      { returning: true }
    );

    // AQUI ESTÁ A INTEGRAÇÃO: Publica a mensagem na fila
    const queueName = "translation_requests";
    publishToQueue(queueName, JSON.stringify(newTranslation));

    return res.status(202).json({
      message:
        "Requisição de tradução recebida e está na fila para processamento.",
      requestId: newTranslation.id,
    });
  } catch (error) {
    console.error("[API] Erro ao criar a requisição de tradução:", error);
    return res.status(500).json({ message: "Erro interno do servidor." });
  }
});

// ========= ROTA DE CONSULTA DE STATUS - VERSÃO FINAL =========
app.get("/translations/:requestId", async (req: Request, res: Response) => {
  try {
    const { requestId } = req.params;

    // Usa o método findByPk (Find by Primary Key) do Sequelize
    const translation = await Translation.findByPk(requestId);

    // Se não encontrar nenhum registro com esse ID, retorna 404
    if (!translation) {
      return res.status(404).json({ message: "Tradução não encontrada." });
    }

    // Se encontrar, retorna o objeto completo da tradução com status 200
    return res.status(200).json(translation);
  } catch (error) {
    console.error("[API] Erro ao consultar a tradução:", error);
    return res.status(500).json({ message: "Erro interno do servidor." });
  }
});

// INICIALIZAÇÃO ATUALIZADA
app.listen(port, async () => {
  try {
    console.log(`✅ Translation API escutando na porta ${port}`);
    await testConnection(); // Conecta ao DB
    await initRabbitMQ(); // Conecta ao RabbitMQ
  } catch (error) {
    console.error("❌ Failed to start the API:", error);
    process.exit(1);
  }
});
