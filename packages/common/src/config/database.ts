import dotenv from "dotenv";
import path from "path"; // 1. Importe o módulo 'path'
import { Sequelize } from "sequelize";

// 2. Crie o caminho explícito para o arquivo .env na raiz do projeto
const envPath = path.resolve(__dirname, "../../../../.env");

// 3. Carregue as variáveis de ambiente a partir do caminho especificado
dotenv.config({ path: envPath });

const dbName = process.env.DB_NAME as string;
const dbUser = process.env.DB_USER as string;
const dbHost = process.env.DB_HOST;
const dbPassword = process.env.DB_PASSWORD;

// DEBUG: Estas linhas agora devem mostrar os valores corretos
console.log("--- Tentando conectar com as seguintes variáveis ---");
console.log(`Caminho do .env: ${envPath}`);
console.log(`DB_HOST: ${dbHost}`);
console.log(`DB_USER: ${dbUser}`);
console.log(`DB_NAME: ${dbName}`);
console.log("----------------------------------------------------");

// Cria uma nova instância do Sequelize para a conexão com o banco
const sequelize = new Sequelize(dbName, dbUser, dbPassword, {
  host: dbHost,
  dialect: "postgres",
  logging: false,
});

// Função para testar a conexão
export const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log(
      "✅ Connection to the database has been established successfully."
    );
  } catch (error) {
    console.error("❌ Unable to connect to the database:", error);
    throw error;
  }
};

export default sequelize;
