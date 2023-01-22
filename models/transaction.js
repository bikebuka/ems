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
    payerId: {
      allowNull: true,
      type: DataTypes.INTEGER,
      references: {
        model: 'Users',
        key:'id'
      },
    },
    amount: {
      allowNull: true,
      type: DataTypes.DOUBLE
    },
    paymentMode: {
      allowNull: true,
      type: DataTypes.ENUM("M-PESA","CASH","T-KASH","AIRTEL-MONEY","CARD")
    },
    accountNumber: {
      allowNull: true,
      type: DataTypes.STRING
    },
    accountReference: {
      allowNull: true,
      type: DataTypes.STRING
    },
    merchantRequestId: {
      allowNull: true,
      type: DataTypes.STRING
    },
    checkoutRequestId: {
      allowNull: true,
      type: DataTypes.STRING
    },
    responseCode: {
      allowNull: true,
      type: DataTypes.STRING
    },
    resultCode: {
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
    errorCode: {
      allowNull: true,
      type: DataTypes.STRING
    },
    errorMessage: {
      allowNull: true,
      type: DataTypes.STRING
    },
  }, {
    sequelize,
    modelName: 'Transaction',
  });
  return Transaction;
};
