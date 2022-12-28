'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('RolePermissions', {
      role_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references:{
          model: 'Roles',
          key:'id'
        },
        onUpdate:'cascade',
        onDelete:'cascade',
      },
      permission_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references:{
          model: 'Permissions',
          key:'id'
        },
        onUpdate:'cascade',
        onDelete:'cascade',
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('RolePermissions');
  }
};
