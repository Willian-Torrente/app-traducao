"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const uuidv7_1 = require("uuidv7");
const database_1 = __importDefault(require("../config/database"));
// Define a classe do Modelo que estende o Model do Sequelize
class Translation extends sequelize_1.Model {
    // Timestamps
    createdAt;
    updatedAt;
}
// Inicializa o modelo, definindo a estrutura da tabela no banco de dados
Translation.init({
    id: {
        type: sequelize_1.DataTypes.UUID,
        defaultValue: uuidv7_1.uuidv7, // Gera um UUID v7 automaticamente
        primaryKey: true,
        allowNull: false,
    },
    status: {
        type: sequelize_1.DataTypes.ENUM("queued", "processing", "completed", "failed"),
        defaultValue: "queued",
        allowNull: false,
    },
    originalText: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: false,
    },
    sourceLanguage: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    targetLanguage: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    translatedText: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: true, // O texto traduzido pode ser nulo inicialmente
    },
}, {
    tableName: "translations", // Nome da tabela no banco de dados
    sequelize: // Nome da tabela no banco de dados
    database_1.default, // Passa a instância da conexão do Sequelize
    timestamps: true, // Cria os campos createdAt e updatedAt automaticamente
});
exports.default = Translation;
//# sourceMappingURL=Translation.js.map