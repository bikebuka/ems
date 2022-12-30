'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
    */
    await queryInterface.bulkInsert('LandOwners', [{
      id: 1,
      first_name: "John",
      last_name: "Doe",
      email_address: "johndoe@example.com",
      phone_number: "0748730956",
      is_active: 1,
      is_deleted: 0,
      is_updated: 0,
      createdAt: new Date(),
      updatedAt: new Date()
    }], {});
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     */
    await queryInterface.bulkDelete('LandOwners', null, {});
  }
};
