'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Payments', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      user_token: {
        type: Sequelize.UUID
      },
      transaction_subtotal: {
        type: Sequelize.DOUBLE
      },
      order: {
        type: Sequelize.UUID
      },
      vendor_pay: {
        type: Sequelize.DOUBLE
      },
      sms_cost: {
        type: Sequelize.DOUBLE
      },
      transaction_id: {
        type: Sequelize.UUID
      },
      customer_name: {
        type: Sequelize.STRING
      },
      transaction_phone: {
        type: Sequelize.STRING
      },
      transaction_amount: {
        type: Sequelize.DOUBLE
      },
      transaction_date: {
        type: Sequelize.DATE
      },
      transaction_type: {
        type: Sequelize.STRING
      },
      callback_url: {
        type: Sequelize.STRING
      },
      callback_status: {
        type: Sequelize.STRING
      },
      status: {
        type: Sequelize.STRING
      },
      vat: {
        type: Sequelize.DOUBLE
      },
      type: {
        type: Sequelize.STRING
      },
      ref: {
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
    await queryInterface.dropTable('Payments');
  }
};