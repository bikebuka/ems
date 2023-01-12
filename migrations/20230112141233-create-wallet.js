'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Wallets', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      userId: {
        allowNull: false,
        unique:true,
        type: Sequelize.INTEGER
      },
      unitId: {
        allowNull: false,
        unique:true,
        type: Sequelize.INTEGER
      },
      agencyId: {
        allowNull: false,
        unique:true,
        type: Sequelize.INTEGER
      },
      account_balance: {
        allowNull: false,
        type: Sequelize.DOUBLE
      },
      status:{
        type:Sequelize.ENUM("ACTIVE","INACTIVE"),
        default:"ACTIVE"
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
    await queryInterface.dropTable('Wallets');
  }
};