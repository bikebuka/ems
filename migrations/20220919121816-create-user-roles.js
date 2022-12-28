'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('UserRoles', {
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
      user_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references:{
          model: 'Users',
          key:'id'
        },
        onUpdate:'cascade',
        onDelete:'cascade',
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('UserRoles');
  }
};