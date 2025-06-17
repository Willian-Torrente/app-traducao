"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("translations", {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.literal("gen_random_uuid()"),
        allowNull: false,
        primaryKey: true,
      },
      status: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: "queued",
      },
      originalText: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      sourceLanguage: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      targetLanguage: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      translatedText: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("translations");
  },
};
