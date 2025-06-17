"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.testConnection = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path")); // 1. Importe o módulo 'path'
const sequelize_1 = require("sequelize");
// 2. Crie o caminho explícito para o arquivo .env na raiz do projeto
const envPath = path_1.default.resolve(__dirname, "../../../../.env");
// 3. Carregue as variáveis de ambiente a partir do caminho especificado
dotenv_1.default.config({ path: envPath });
const dbName = process.env.DB_NAME;
const dbUser = process.env.DB_USER;
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
const sequelize = new sequelize_1.Sequelize(dbName, dbUser, dbPassword, {
    host: dbHost,
    dialect: "postgres",
    logging: false,
});
// Função para testar a conexão
const testConnection = async () => {
    try {
        await sequelize.authenticate();
        console.log("✅ Connection to the database has been established successfully.");
    }
    catch (error) {
        console.error("❌ Unable to connect to the database:", error);
        throw error;
    }
};
exports.testConnection = testConnection;
exports.default = sequelize;
//# sourceMappingURL=database.js.map