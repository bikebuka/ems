'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Invoices', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      order_id: {
        type: Sequelize.UUID
      },
      token: {
        type: Sequelize.STRING
      },
      subtotal: {
        type: Sequelize.DOUBLE
      },
      customer_name: {
        type: Sequelize.STRING
      },
      callback_url: {
        type: Sequelize.STRING
      },
      amount: {
        type: Sequelize.DOUBLE
      },
      status: {
        type: Sequelize.STRING
      },
      invoice_number: {
        type: Sequelize.STRING
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
    await queryInterface.dropTable('Invoices');
  }
};