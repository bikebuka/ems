'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('PasswordResets', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
        primaryKey: true,
      },
      user_id: {
        type: Sequelize.UUID,
        references:{
          model:'Users',
          key:'id'
        },
        onDelete:'cascade'
      },
      provider: {
        type: Sequelize.STRING
      },
      password_reset_token: {
        type: Sequelize.STRING,
        unique: true
      },
      password_reset_at: {
        type: Sequelize.STRING
      },
      isUsed: {
        type: Sequelize.BOOLEAN
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
    await queryInterface.dropTable('PasswordResets');
  }
};
