'use strict';
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const slugify = require('slugify')

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    let unit_type = [];
    try {
      const data = fs.readFileSync(path.join(__dirname,'../seedata','unit_type.txt'),'UTF-8');
      const lines = data.split(/\r?\n/);

      lines.forEach((line)=>{
        line = line.trim();
        unit_type.push({
          id:uuidv4(),
          unit_type_name: line,
          unit_type_slug: slugify(line, {lower: true}),
          is_active: true,
          createdAt:new Date(),
          updatedAt: new Date()
        });
      });
    }catch (e) {
      console.error(e)
    }
    return queryInterface.bulkInsert('UnitTypes', unit_type,{});
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    return queryInterface.bulkDelete('UnitTypes', null, {});
  }
};
