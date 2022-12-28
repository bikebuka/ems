'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('PropertyUnits', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
        primaryKey: true,
      },
      property_id: {
        type: Sequelize.UUID,
        references : {
          model: 'Properties',
          key: 'id',
        },
        onDelete: 'cascade',
        onUpdate: 'cascade'
      },
      unit_id: {
        type: Sequelize.UUID,
        references: {
          model: 'Units',
          key: 'id'
        },
        onDelete: 'cascade',
        onUpdate: 'cascade'
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('PropertyUnits');
  }
};
