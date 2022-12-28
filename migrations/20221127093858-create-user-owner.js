'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('UserOwners', {
      user_id: {
        type: Sequelize.UUID,
        references: {
          model: 'Users',
          key: 'id'
        },
        onUpdate:'cascade',
        onDelete: 'cascade'
      },
      owner_id: {
        type: Sequelize.UUID,
        references: {
          model: 'LandOwners',
          key: 'id'
        },
        onDelete: 'cascade',
        onUpdate: 'cascade'
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('UserOwners');
  }
};
