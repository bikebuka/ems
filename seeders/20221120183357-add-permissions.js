'use strict';
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const slugify = require('slugify');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    let permissions = [];
    try {
      const data = fs.readFileSync(path.join(__dirname,'../seedata','permissions.txt'),'UTF-8');
      const lines = data.split(/\r?\n/);

      lines.forEach((line)=>{
        line = line.trim();
        permissions.push({
          id:uuidv4(),
          permission_name: line.split('|')[0],
          permission_slug: slugify(line.split('|')[0], {lower: true}),
          permission_description: line.split('|')[1],
          IsActive: true,
          IsDeleted: false,
          createdAt:new Date(),
          updatedAt: new Date()
        });
      });
    }catch (e) {
      console.error(e)
    }
    return queryInterface.bulkInsert('Permissions', permissions,{});
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    return queryInterface.bulkDelete('Permissions', null, {});
  }
};
