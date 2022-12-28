'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Companies', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
        primaryKey: true,
      },
      company_name: {
        type: Sequelize.STRING
      },
      company_slug:{
        type: Sequelize.STRING
      },
      office_email: {
        type: Sequelize.STRING
      },
      office_phone: {
        type: Sequelize.STRING
      },
      office_cell: {
        type: Sequelize.STRING
      },
      office_name: {
        type: Sequelize.STRING
      },
      building_name: {
        type: Sequelize.STRING
      },
      road_street: {
        type: Sequelize.STRING
      },
      office_floor: {
        type: Sequelize.STRING
      },
      website: {
        type: Sequelize.STRING
      },
      address_1: {
        type: Sequelize.STRING
      },
      address_2: {
        type: Sequelize.STRING
      },
      description: {
        type: Sequelize.STRING
      },
      created_by: {
        type: Sequelize.UUID,
        references: {
          model: 'Users',
          key: 'id'
        },
        onDelete: 'cascade',
        onUpdate:'cascade'
      },
      is_agency:{
        type: Sequelize.BOOLEAN
      },
      is_active: {
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
    await queryInterface.dropTable('Companies');
  }
};
