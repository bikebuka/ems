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
        allowNull: true,
        type: Sequelize.STRING
      },
      transactionCode: {
        allowNull: true,
        type: Sequelize.STRING
      },
      transactionDate: {
        allowNull: true,
        type: Sequelize.DATE
      },
      unitId: {
        allowNull: true,
        type: Sequelize.INTEGER,
        references: {
          model: 'Units',
          key:'id'
        },
      },
      payerId: {
        allowNull: true,
        type: Sequelize.INTEGER,
        references: {
          model: 'Users',
          key:'id'
        },
      },
      amount: {
        allowNull: true,
        type: Sequelize.DOUBLE
      },
      paymentMode: {
        allowNull: true,
        type: Sequelize.ENUM("M-PESA","CASH","T-KASH","AIRTEL-MONEY","CARD")
      },
      accountNumber: {
        allowNull: true,
        type: Sequelize.STRING
      },
      accountReference: {
        allowNull: true,
        type: Sequelize.STRING
      },
      merchantRequestId: {
        allowNull: true,
        type: Sequelize.STRING
      },
      checkoutRequestId: {
        allowNull: true,
        type: Sequelize.STRING
      },
      responseCode: {
        allowNull: true,
        type: Sequelize.STRING
      },
      resultCode: {
        allowNull: true,
        type: Sequelize.STRING
      },
      attachment: {
        allowNull: true,
        type: Sequelize.STRING
      },
      promiseToPay: {
        type: Sequelize.BOOLEAN,
        default:true
      },
      recipientBankAccountNumber: {
        allowNull: true,
        type: Sequelize.STRING
      },
      errorCode: {
        allowNull: true,
        type: Sequelize.STRING
      },
      errorMessage: {
        allowNull: true,
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: true,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: true,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Transactions');
  }
};
