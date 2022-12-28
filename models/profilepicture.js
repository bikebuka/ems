'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ProfilePicture extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      ProfilePicture.belongsTo(models.Users, {foreignKey: 'user_id'})
    }
  }
  ProfilePicture.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true,
    },
    user_id: {
      type: DataTypes.UUID,
      allowNull: false
    },
    file_name: {
      type:DataTypes.STRING,
      allowNull: false
    },
    file_path: {
      type:DataTypes.STRING,
      allowNull: false
    },
    original_name: {
      type:DataTypes.STRING,
      allowNull: false
    },
    file_size: {
      type:DataTypes.STRING,
      allowNull: false
    },
    is_deleted: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
  }, {
    sequelize,
    modelName: 'ProfilePicture',
  });
  return ProfilePicture;
};
