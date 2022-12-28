'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('AgentProperties', {
      agent_id: {
        type: Sequelize.UUID,
        references: {
          model: 'Agents',
          key: 'id'
        },
        onDelete:'cascade',
        onUpdate: 'cascade'
      },
      property_id: {
        type: Sequelize.UUID,
        references: {
          model: 'Properties',
          key: 'id'
        },
        onDelete: 'cascade',
        onUpdate: 'cascade'
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('AgentProperties');
  }
};
