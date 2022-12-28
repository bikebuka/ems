'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Users', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
        primaryKey: true,
      },
      first_name: {
        type: Sequelize.STRING
      },
      last_name: {
        type: Sequelize.STRING
      },
      email_address: {
        type: Sequelize.STRING
      },
      phone_number: {
        type: Sequelize.STRING
      },
      username: {
        type: Sequelize.STRING
      },
      description:{
        type: Sequelize.STRING(1000)
      },
      password: {
        type: Sequelize.STRING
      },
      IsActive: {
        type: Sequelize.BOOLEAN
      },
      IsDeleted: {
        type: Sequelize.BOOLEAN
      },
      createdBy: {
        type: Sequelize.UUID
      },
      IsApproved: {
        type: Sequelize.BOOLEAN
      },
      ApprovedBy: {
        type: Sequelize.UUID
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: new Date(),
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: new Date(),
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Users');
  }
};
