'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Rents', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      unitId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Units',
          key:'id'
        },
        onUpdate:'cascade',
        onDelete:'cascade',
      },
      tenantId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Tenants',
          key:'id'
        },
      },
      amountPaid: {
        type: Sequelize.DOUBLE
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
    await queryInterface.dropTable('Rents');
  }
};
