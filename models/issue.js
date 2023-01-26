'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Issue extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Issue.init({
    type: DataTypes.ENUM,
    name: DataTypes.STRING,
    description: DataTypes.STRING,
    reportedBy: DataTypes.INTEGER,
    reportedTo: DataTypes.INTEGER,
    status: DataTypes.ENUM
  }, {
    sequelize,
    modelName: 'Issue',
  });
  return Issue;
};