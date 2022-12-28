'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('RefreshTokens', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
        primaryKey: true,
      },
      token: {
        type: Sequelize.STRING
      },
      expiry_date: {
        type: Sequelize.DATE
      },
      user_id: {
        type: Sequelize.UUID,
        references: {
          model:'Users',
          key:'id'
        },
        onDelete:'cascade'
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('RefreshTokens');
  }
};
