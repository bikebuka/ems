'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('PropertyCategories', {
      property_id: {
        type: Sequelize.UUID,
        references: {
          model: 'Properties',
          key: 'id'
        },
        onDelete: 'cascade',
        onUpdate: 'cascade'
      },
      category_id: {
        type: Sequelize.UUID,
        references: {
          model: 'Categories',
          key: 'id'
        },
        onDelete: 'cascade',
        onUpdate: 'cascade'
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('PropertyCategories');
  }
};
