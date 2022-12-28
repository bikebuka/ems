'use strict';
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const slugify = require('slugify')

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
    let property_category = [];
    try {
      const data = fs.readFileSync(path.join(__dirname,'../seedata','property_category.txt'),'UTF-8');
      const lines = data.split(/\r?\n/);

      lines.forEach((line)=>{
        line = line.trim();
        property_category.push({
          id:uuidv4(),
          name: line.split('|')[0],
          slug: slugify(line.split('|')[0], {lower: true}),
          description: line.split('|')[1],
          createdAt:new Date(),
          updatedAt: new Date()
        });
      });
    }catch (e) {
      console.error(e)
    }
    return queryInterface.bulkInsert('Categories', property_category,{});
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    return queryInterface.bulkDelete('Categories', null, {});
  }
};
