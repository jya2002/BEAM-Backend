'use strict';

/** @type {import('sequelize-cli').Migration} */

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Create the table first
    await queryInterface.createTable('Favorites', {
      favorite_id: {
        type: Sequelize.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },
      user_id: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      listing_id: {
      type: Sequelize.INTEGER.UNSIGNED,
      allowNull: false,
      references: {
        model: 'Listings',
        key: 'listing_id', 
      },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      added_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
    });

    // Add unique constraint only if it doesn't exist
    await queryInterface.addConstraint('Favorites', {
      fields: ['user_id', 'listing_id'],
      type: 'unique',
      name: 'unique_favorite',
    }).catch(error => {
      // Log and ignore if the constraint already exists
      if (error.name !== 'SequelizeDatabaseError' || !error.message.includes('Duplicate key name')) {
        throw error;
      }
      console.log('Unique constraint "unique_favorite" already exists.');
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Favorites');
  },
};


