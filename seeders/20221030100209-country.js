'use strict';
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const slugify = require('slugify');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    let country = [];
    try {
      const data = fs.readFileSync(path.join(__dirname,'../seedata','country.txt'),'UTF-8');
      const lines = data.split(/\r?\n/);

      lines.forEach((line)=>{
        line = line.trim();
        country.push({
          id:uuidv4(),
          name: line.split('|')[1],
          slug: slugify(line.split('|')[1], {lower: true}),
          short_name: line.split('|')[0],
          createdAt:new Date(),
          updatedAt: new Date()
        });
      });
    }catch (e) {
      console.error(e)
    }
    return queryInterface.bulkInsert('Countries', country,{});
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    return queryInterface.bulkDelete('Countries', null, {});
  }
};
