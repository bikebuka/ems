'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('PropertyCountries', {
      property_id: {
        type: Sequelize.UUID,
        references: {
          model: 'Properties',
          key: 'id'
        },
        onDelete: 'cascade',
        onUpdate: 'cascade'
      },
      country_id: {
        type: Sequelize.UUID,
        references: {
          model: 'Countries',
          key: 'id'
        },
        onDelete: 'cascade',
        onUpdate: 'cascade'
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('PropertyCountries');
  }
};
