"use strict";
// packages/common/src/index.ts
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Translation = exports.testConnection = exports.sequelize = void 0;
var database_1 = require("./config/database");
Object.defineProperty(exports, "sequelize", { enumerable: true, get: function () { return __importDefault(database_1).default; } });
Object.defineProperty(exports, "testConnection", { enumerable: true, get: function () { return database_1.testConnection; } });
var Translation_1 = require("./models/Translation");
Object.defineProperty(exports, "Translation", { enumerable: true, get: function () { return __importDefault(Translation_1).default; } });
//# sourceMappingURL=index.js.map