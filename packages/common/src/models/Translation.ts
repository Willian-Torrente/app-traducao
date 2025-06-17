import { DataTypes, Model, Optional } from "sequelize";
import { uuidv7 } from "uuidv7";
import sequelize from "../config/database";

// Define a interface para os atributos do modelo
interface TranslationAttributes {
  id: string;
  status: "queued" | "processing" | "completed" | "failed";
  originalText: string;
  sourceLanguage: string;
  targetLanguage: string;
  translatedText: string | null;
  createdAt?: Date;
  updatedAt?: Date;
}

// Define a interface para a criação do objeto (alguns campos são opcionais)
// Usamos Optional para id, createdAt e updatedAt, que serão gerenciados pelo banco/sequelize
interface TranslationCreationAttributes
  extends Optional<
    TranslationAttributes,
    "id" | "createdAt" | "updatedAt" | "translatedText" | "status"
  > {}

// Define a classe do Modelo que estende o Model do Sequelize
class Translation
  extends Model<TranslationAttributes, TranslationCreationAttributes>
  implements TranslationAttributes
{
  declare id: string;
  declare status: "queued" | "processing" | "completed" | "failed";
  declare originalText: string;
  declare sourceLanguage: string;
  declare targetLanguage: string;
  declare translatedText: string | null;

  // Timestamps
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

// Inicializa o modelo, definindo a estrutura da tabela no banco de dados
Translation.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: uuidv7, // Gera um UUID v7 automaticamente
      primaryKey: true,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM("queued", "processing", "completed", "failed"),
      defaultValue: "queued",
      allowNull: false,
    },
    originalText: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    sourceLanguage: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    targetLanguage: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    translatedText: {
      type: DataTypes.TEXT,
      allowNull: true, // O texto traduzido pode ser nulo inicialmente
    },
  },
  {
    tableName: "translations", // Nome da tabela no banco de dados
    sequelize, // Passa a instância da conexão do Sequelize
    timestamps: true, // Cria os campos createdAt e updatedAt automaticamente
  }
);

export default Translation;
