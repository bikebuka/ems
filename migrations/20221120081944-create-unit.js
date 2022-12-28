'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Units', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
        primaryKey: true,
      },
      unit_name: {
        type: Sequelize.STRING
      },
      unit_floor: {
        type: Sequelize.STRING
      },
      rent_amount: {
        type: Sequelize.DOUBLE
      },
      unit_type_id: {
        type: Sequelize.UUID,
        references: {
          model: 'UnitTypes',
          key: 'id'
        },
        onDelete:'cascade',
      },
      bedrooms: {
        type: Sequelize.INTEGER
      },
      bathrooms: {
        type: Sequelize.INTEGER
      },
      total_rooms: {
        type: Sequelize.INTEGER
      },
      square_foot: {
        type: Sequelize.INTEGER
      },
      created_by: {
        type: Sequelize.UUID
      },
      updated_by: {
        type: Sequelize.UUID
      },
      is_deleted: {
        type: Sequelize.BOOLEAN
      },
      is_rented: {
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
    await queryInterface.dropTable('Units');
  }
};
