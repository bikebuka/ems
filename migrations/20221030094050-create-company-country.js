'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('CompanyCountries', {
      company_id: {
        type: Sequelize.UUID,
        references:{
          model:'Companies',
          key:'id',
        },
        onUpdate:'cascade',
        onDelete:'cascade'
      },
      country_id: {
        type: Sequelize.UUID,
        references: {
          model:'Countries',
          key:'id'
        },
        onUpdate: 'cascade',
        onDelete: 'cascade'
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('CompanyCountries');
  }
};
