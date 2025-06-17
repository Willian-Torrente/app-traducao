import express, { Request, Response } from "express";
import { Sequelize } from "sequelize";
import Translation from "../../common/dist/models/Translation";

// Crie uma instância do Sequelize para Postgres
const sequelize = new Sequelize(
  process.env.DB_NAME || "nome_do_banco",
  process.env.DB_USER || "usuario",
  process.env.DB_PASSWORD || "senha",
  {
    host: process.env.DB_HOST || "localhost",
    port: Number(process.env.DB_PORT) || 5432,
    dialect: "postgres",
    logging: false,
  }
);

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

    const requestId = newTranslation.id;

    console.log(
      `[API] Requisição de tradução ${requestId} criada. Deveria ser enviada para a fila.`
    );

    return res.status(202).json({
      message:
        "Requisição de tradução recebida e está na fila para processamento.",
      requestId: requestId,
    });
  } catch (error) {
    console.error("[API] Erro ao criar a requisição de tradução:", error);
    return res.status(500).json({ message: "Erro interno do servidor." });
  }
});

// ========= ROTA DE CONSULTA DE STATUS =========
app.get("/translations/:requestId", (req: Request, res: Response) => {
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
  } catch (error) {
    console.error("Não foi possível conectar ao Postgres:", error);
  }
});
