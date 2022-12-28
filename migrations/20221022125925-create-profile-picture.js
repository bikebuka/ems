'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('ProfilePictures', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
        primaryKey: true,
      },
      user_id: {
        type: Sequelize.UUID,
        references:{
          model:'Users',
          key:'id'
        },
        onDelete: 'cascade',
        onUpdate:'cascade'
      },
      file_name: {
        type: Sequelize.STRING
      },
      file_path: {
        type: Sequelize.STRING
      },
      original_name: {
        type: Sequelize.STRING
      },
      file_size: {
        type: Sequelize.STRING
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
    await queryInterface.dropTable('ProfilePictures');
  }
};
