'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('UserAgents', {
      user_id: {
        type: Sequelize.UUID,
        references: {
          model: 'Users',
          key: 'id'
        },
        onUpdate:'cascade',
        onDelete: 'cascade'
      },
      agent_id: {
        type: Sequelize.UUID,
        references: {
          model: 'Agents',
          key: 'id'
        },
        onUpdate:'cascade',
        onDelete: 'cascade'
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('UserAgents');
  }
};
