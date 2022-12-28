'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('UnitTypes', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
        primaryKey: true,
      },
      unit_type_name: {
        type: Sequelize.STRING
      },
      unit_type_slug: {
        type: Sequelize.STRING
      },
      unit_type_description: {
        type: Sequelize.STRING
      },
      created_by: {
        type: Sequelize.UUID
      },
      updated_by: {
        type: Sequelize.UUID
      },
      deleted_by: {
        type: Sequelize.UUID
      },
      is_active: {
        type: Sequelize.BOOLEAN
      },
      is_updated: {
        type: Sequelize.BOOLEAN
      },
      is_deleted: {
        type: Sequelize.BOOLEAN
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
    await queryInterface.dropTable('UnitTypes');
  }
};
