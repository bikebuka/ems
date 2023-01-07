'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      firstName: {
        type: Sequelize.STRING,
        allowNull: false
      },
      middleName: {
        type: Sequelize.STRING,
        allowNull: true
      },
      lastName: {
        type: Sequelize.STRING,
        allowNull: false
      },
      username: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      emailAddress: {
        type: Sequelize.STRING,
        allowNull: false,
        isEmail:true,
        unique:true
      },
      phoneNumber: {
        type: Sequelize.STRING,
        allowNull: false,
        unique:true,
      },
      userType: {
        type: Sequelize.ENUM("NORMAL","AGENT","AGENCY","LANDLORD","SUPER_ADMIN","ADMIN"),
        allowNull: false,
        defaultValue: "NORMAL"
      },
      password: {
        type: Sequelize.STRING,
        allowNull:false
      },
      status: {
        type: Sequelize.ENUM("PENDING","SUSPENDED","REJECTED","APPROVED"),
        defaultValue:"PENDING"
      },
      approvedBy: {
        type: Sequelize.INTEGER
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
    await queryInterface.dropTable('Users');
  }
};
