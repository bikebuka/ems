'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Transactions', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      transactionId: {
        type: Sequelize.STRING
      },
      transactionCode: {
        allowNull: false,
        type: Sequelize.STRING
      },
      transactionDate: {
        type: Sequelize.DATE
      },
      unitId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Units',
          key:'id'
        },
      },
      payerId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Users',
          key:'id'
        },
      },
      amount: {
        type: Sequelize.DOUBLE
      },
      paymentMode: {
        allowNull: false,
        type: Sequelize.ENUM("M-PESA","CASH","T-KASH","AIRTEL-MONEY","CARD")
      },
      accountNumber: {
        allowNull: false,
        type: Sequelize.STRING
      },
      accountReference: {
        allowNull: false,
        type: Sequelize.STRING
      },
      merchantRequestId: {
        allowNull: false,
        type: Sequelize.STRING
      },
      checkoutRequestId: {
        allowNull: false,
        type: Sequelize.STRING
      },
      responseCode: {
        allowNull: false,
        type: Sequelize.STRING
      },
      resultCode: {
        allowNull: false,
        type: Sequelize.STRING
      },
      attachment: {
        allowNull: false,
        type: Sequelize.STRING
      },
      promiseToPay: {
        type: Sequelize.BOOLEAN,
        default:false
      },
      recipientBankAccountNumber: {
        allowNull: false,
        type: Sequelize.STRING
      },
      errorCode: {
        allowNull: false,
        type: Sequelize.STRING
      },
      errorMessage: {
        allowNull: false,
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
    await queryInterface.dropTable('Transactions');
  }
};
