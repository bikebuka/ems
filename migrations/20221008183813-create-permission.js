'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Permissions', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
        primaryKey: true,
      },
      permission_name: {
        type: Sequelize.STRING
      },
      permission_slug: {
        type: Sequelize.STRING
      },
      permission_description: {
        type: Sequelize.STRING(1000)
      },
      IsActive: {
        type: Sequelize.BOOLEAN
      },
      IsDeleted: {
        type: Sequelize.BOOLEAN
      },
      createdBy: {
        type: Sequelize.UUID,
        references:{
          model: 'Users',
          key:'id'
        },
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
    await queryInterface.dropTable('Permissions');
  }
};
