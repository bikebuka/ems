'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('UserTenants', {
      user_id: {
        type: Sequelize.UUID,
        references: {
          model: 'Users',
          key: 'id'
        },
        onDelete:'cascade',
        onUpdate:'cascade'
      },
      tenant_id: {
        type: Sequelize.UUID,
        references: {
          model: 'Tenants',
          key:'id'
        },
        onDelete: 'cascade',
        onUpdate: 'cascade'
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('UserTenants');
  }
};
