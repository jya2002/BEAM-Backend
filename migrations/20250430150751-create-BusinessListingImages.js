'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('BusinessListingImages', {
      image_id: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
      },
      business_listing_id: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false
      },
      image_path: {
        type: Sequelize.STRING(255),
        allowNull: false
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });

    // Adding foreign key constraint
    await queryInterface.addConstraint('BusinessListingImages', {
      fields: ['business_listing_id'],
      type: 'foreign key',
      name: 'business_listing_images_business_listing_id_fkey',
      references: {
        table: 'BusinessListings',
        field: 'business_listing_id'
      },
      onDelete: 'CASCADE'
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('BusinessListingImages');
  }
};

