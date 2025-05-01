'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Listings', {
      listing_id: {
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
      category_id: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: true,
        references: {
          model: 'Categories',
          key: 'category_id',
        },
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
      },
      location_id: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: true,
        references: {
          model: 'Locations',
          key: 'location_id',
        },
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
      },
      title_am: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      title_en: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      description_am: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      description_en: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      price: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
      },
      image_path: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      status: {
        type: Sequelize.ENUM('available', 'sold', 'pending'),
        allowNull: false,
      },
      view_count: {
        type: Sequelize.INTEGER.UNSIGNED,
        defaultValue: 0,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'),
      },
      deleted_at: {
        type: Sequelize.DATE,
        allowNull: true,
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    // Optional: Remove ENUM type first if needed to avoid Postgres issues
    await queryInterface.dropTable('Listings');
  },
};
