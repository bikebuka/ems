'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Tenants', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      userId: {
        type: Sequelize.INTEGER,
        unique:true,
        references: {
          model:"Users",
          key:'id'
        },
        onUpdate:'cascade',
        onDelete:'cascade'
      },
      unitId: {
        type: Sequelize.INTEGER,
        unique:true,
        references: {
          model:"Units",
          key:'id'
        },
        onUpdate:'cascade',
        onDelete:'cascade'
      },
      checkIn: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('now')
      },
      checkOut: {
        type: Sequelize.DATE
      },
      status: {
        type: Sequelize.ENUM("PAID","PARTIALLY_PAID","PENDING_PAYMENT"),
        defaultValue:"PENDING_PAYMENT"
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
    await queryInterface.dropTable('Tenants');
  }
};
