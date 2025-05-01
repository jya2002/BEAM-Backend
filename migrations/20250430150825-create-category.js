'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Categories', {
      category_id: {
        type: Sequelize.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },
      name_am: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      name_en: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      description_am: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      description_en: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      parent_id: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: true,
        references: {
          model: 'Categories',
          key: 'category_id',
        },
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
      },
      is_deleted: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
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
    });
  },

  down: async (queryInterface, Sequelize) => {
    // First remove Listings' foreign key that depends on Categories
    const tableDesc = await queryInterface.describeTable('Listings');
    if (tableDesc.category_id) {
      try {
        await queryInterface.removeConstraint('Listings', 'listings_ibfk_2');
      } catch (error) {
        console.warn("Constraint 'listings_ibfk_2' not found, skipping.");
      }
    }

    // Drop Listings first, then Categories
    const [listings] = await queryInterface.sequelize.query("SHOW TABLES LIKE 'Listings'");
    if (listings.length > 0) {
      await queryInterface.dropTable('Listings');
    }

    const [categories] = await queryInterface.sequelize.query("SHOW TABLES LIKE 'Categories'");
    if (categories.length > 0) {
      await queryInterface.dropTable('Categories');
    }
  },
};
