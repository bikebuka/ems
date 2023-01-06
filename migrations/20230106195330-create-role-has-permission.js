'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('RoleHasPermissions', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      roleId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references:{
          model: 'Roles',
          key:'id'
        },
        onUpdate:'cascade',
        onDelete:'cascade',
      },
      permissionId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references:{
          model: 'Permissions',
          key:'id'
        },
        onUpdate:'cascade',
        onDelete:'cascade',
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
    await queryInterface.dropTable('RoleHasPermissions');
  }
};
