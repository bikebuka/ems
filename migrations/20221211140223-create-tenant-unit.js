'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('TenantUnits', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
        primaryKey: true,
      },
      tenant_id: {
        type: Sequelize.UUID,
        // references: {
        //   model: 'Tenants',
        //   key: 'id'
        // },
        // onDelete: 'cascade',
        // onUpdate: 'cascade'
      },
      unit_id: {
        type: Sequelize.UUID,
        // references: {
        //   model: 'Units',
        //   key: 'id'
        // },
        // onDelete: 'cascade',
        // onUpdate: 'cascade'
      },
      current_owner: {
        type: Sequelize.BOOLEAN
      },
      date_rented: {
        type: Sequelize.DATE
      },
      date_left: {
        type: Sequelize.DATE,
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('TenantUnits');
  }
};
