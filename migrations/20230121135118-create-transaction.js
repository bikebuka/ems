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
    payerID: {
        allowNull: true,
        type: Sequelize.INTEGER,
        references: {
          model: 'Users',
          key:'id'
        },
      },
      payerNames: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      amount: {
        allowNull: true,
        type: Sequelize.DOUBLE
      },
      paymentMode: {
        allowNull: true,
        type: Sequelize.ENUM("M-PESA","CASH","T-KASH","AIRTEL-MONEY","CARD")
      },
      status: {
        allowNull: true,
        type: Sequelize.ENUM("pending","success","failed"),
        default:'pending'
      },
      accountNumber: {
        allowNull: true,
        type: Sequelize.STRING
      },
      description: {
        allowNull: true,
        type: Sequelize.TEXT
      },
      accountReference: {
        allowNull: true,
        type: Sequelize.STRING
      },
      MerchantRequestID: {
        allowNull: true,
        type: Sequelize.STRING
      },
      CheckoutRequestID: {
        allowNull: true,
        type: Sequelize.STRING
      },
      sourceDocumentNo: {
        allowNull: true,
        type: Sequelize.STRING
      },
      sourceDocumentType: {
        allowNull: true,
        type: Sequelize.STRING
      },
      customerNumber: {
        allowNull: true,
        type: Sequelize.STRING
      },
      ResponseCode: {
        allowNull: true,
        type: Sequelize.STRING
      },
      ResultCode: {
        allowNull: true,
        type: Sequelize.STRING
      },
      providerID: {
        allowNull: true,
        type: Sequelize.STRING
      },
      TransactionReceiptNumber: {
        allowNull: true,
        type: Sequelize.STRING
      },
      ResultDesc: {
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
      ResponseDescription: {
        allowNull: true,
        type: Sequelize.TEXT
      },
      CustomerMessage: {
        allowNull: true,
        type: Sequelize.TEXT
      },
      errorCode: {
        allowNull: true,
        type: Sequelize.STRING
      },
      requestId: {
        allowNull: true,
        type: Sequelize.STRING
      },
      Metadata: {
        allowNull: true,
        type: Sequelize.TEXT
      },
      errorMessage: {
        allowNull: true,
        type: Sequelize.TEXT
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
