'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('UserCompanies', {
      user_id: {
        type: Sequelize.UUID,
        references:{
          model: 'Users',
          key:'id'
        },
        onUpdate:'cascade',
        onDelete:'cascade'
      },
      company_id: {
        type: Sequelize.UUID,
        references: {
          model:'Companies',
          key:'id'
        },
        onDelete: 'cascade',
        onUpdate: 'cascade'
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('UserCompanies');
  }
};
