import { Model, Optional } from "sequelize";
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
interface TranslationCreationAttributes
  extends Optional<
    TranslationAttributes,
    "id" | "createdAt" | "updatedAt" | "translatedText" | "status"
  > {}
declare class Translation
  extends Model<TranslationAttributes, TranslationCreationAttributes>
  implements TranslationAttributes
{
  declare id: string;
  declare status: "queued" | "processing" | "completed" | "failed";
  declare originalText: string;
  declare sourceLanguage: string;
  declare targetLanguage: string;
  declare translatedText: string | null;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}
export default Translation;
