'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Units', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      propertyId:{
        type:Sequelize.INTEGER,
        references: {
          model:"Properties",
          key:"id"
        },
        onUpdate:"cascade",
        onDelete:"cascade",
      },
      name: {
        type: Sequelize.STRING
      },
      floor: {
        type: Sequelize.STRING
      },
      rentAmount: {
        type: Sequelize.DOUBLE
      },
      bedrooms: {
        type: Sequelize.INTEGER
      },
      bathrooms: {
        type: Sequelize.INTEGER
      },
      totalRooms: {
        type: Sequelize.INTEGER
      },
      squareFoot: {
        type: Sequelize.STRING
      },
      isRented: {
        type: Sequelize.BOOLEAN
      },
      counter: {
        type:Sequelize.INTEGER,
        defaultValue: 1
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
    await queryInterface.dropTable('Units');
  }
};
