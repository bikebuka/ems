'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('PropertyOwners', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
        primaryKey: true,
      },
      property_id: {
        type: Sequelize.UUID,
        references: {
          model: 'Properties',
          key: 'id'
        },
        onDelete:'cascade',
        onUpdate:'cascade'
      },
      owner_id: {
        type: Sequelize.UUID,
        references: {
          model: 'Users',
          key:'id'
        },
        onDelete: 'cascade',
        onUpdate: 'cascade'
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('PropertyOwners');
  }
};
