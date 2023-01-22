'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Transaction extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Transaction.init({
    transactionId: {
      allowNull: true,
      type: DataTypes.STRING
    },
    transactionCode: {
      allowNull: true,
      type: DataTypes.STRING
    },
    transactionDate: {
      allowNull: true,
      type: DataTypes.DATE
    },
    unitId: {
      allowNull: true,
      type: DataTypes.INTEGER,
      references: {
        model: 'Units',
        key:'id'
      },
    },
    payerID: {
      allowNull: true,
      type: DataTypes.INTEGER,
      references: {
        model: 'Users',
        key:'id'
      },
    },
    payerNames: {
      allowNull: true,
      type: DataTypes.STRING,
    },
    amount: {
      allowNull: true,
      type: DataTypes.DOUBLE
    },
    paymentMode: {
      allowNull: true,
      type: DataTypes.ENUM("M-PESA","CASH","T-KASH","AIRTEL-MONEY","CARD")
    },
    status: {
      allowNull: true,
      type: DataTypes.ENUM("pending","success","failed"),
      default:'pending'
    },
    accountNumber: {
      allowNull: true,
      type: DataTypes.STRING
    },
    description: {
      allowNull: true,
      type: DataTypes.TEXT
    },
    accountReference: {
      allowNull: true,
      type: DataTypes.STRING
    },
    MerchantRequestID: {
      allowNull: true,
      type: DataTypes.STRING
    },
    CheckoutRequestID: {
      allowNull: true,
      type: DataTypes.STRING
    },
    sourceDocumentNo: {
      allowNull: true,
      type: DataTypes.STRING
    },
    sourceDocumentType: {
      allowNull: true,
      type: DataTypes.STRING
    },
    customerNumber: {
      allowNull: true,
      type: DataTypes.STRING
    },
    ResponseCode: {
      allowNull: true,
      type: DataTypes.STRING
    },
    ResultCode: {
      allowNull: true,
      type: DataTypes.STRING
    },
    providerID: {
      allowNull: true,
      type: DataTypes.STRING
    },
    TransactionReceiptNumber: {
      allowNull: true,
      type: DataTypes.STRING
    },
    ResultDesc: {
      allowNull: true,
      type: DataTypes.STRING
    },
    attachment: {
      allowNull: true,
      type: DataTypes.STRING
    },
    promiseToPay: {
      type: DataTypes.BOOLEAN,
      default:true
    },
    recipientBankAccountNumber: {
      allowNull: true,
      type: DataTypes.STRING
    },
    ResponseDescription: {
      allowNull: true,
      type: DataTypes.TEXT
    },
    CustomerMessage: {
      allowNull: true,
      type: DataTypes.TEXT
    },
    errorCode: {
      allowNull: true,
      type: DataTypes.STRING
    },
    requestId: {
      allowNull: true,
      type: DataTypes.STRING
    },
    Metadata: {
      allowNull: true,
      type: DataTypes.TEXT
    },
    errorMessage: {
      allowNull: true,
      type: DataTypes.TEXT
    },
  }, {
    sequelize,
    modelName: 'Transaction',
  });
  return Transaction;
};
