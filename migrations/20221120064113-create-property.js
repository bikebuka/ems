'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Properties', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
        primaryKey: true,
      },
      property_name: {
        type: Sequelize.STRING
      },
      property_slug: {
        type: Sequelize.STRING
      },
      property_description: {
        type: Sequelize.STRING(1000)
      },
      property_location: {
        type: Sequelize.STRING
      },
      property_code: {
        type: Sequelize.STRING
      },
      created_by: {
        type: Sequelize.UUID,
        references: {
          model: 'Users',
          key: 'id'
        }
      },
      is_deleted: {
        type: Sequelize.BOOLEAN
      },
      is_updated: {
        type: Sequelize.BOOLEAN
      },
      updated_by: {
        type: Sequelize.UUID
      },
      agency_id: {
        type: Sequelize.UUID
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
    await queryInterface.dropTable('Properties');
  }
};
