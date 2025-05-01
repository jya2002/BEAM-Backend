'use strict';

/** @type {import('sequelize-cli').Migration} */

module.exports = {
  up: async (queryInterface, DataTypes) => {
    await queryInterface.createTable('Reviews', {
      review_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },
      buyer_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      seller_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      listing_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        references: {
          model: 'Listings',
          key: 'listing_id',
        },
        onDelete: 'CASCADE',
      },
      transaction_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: true,
        unique: true,
        references: {
          model: 'Transactions',
          key: 'transaction_id',
        },
        onDelete: 'CASCADE',
      },
      rating: {
        type: DataTypes.TINYINT.UNSIGNED,
        allowNull: false,
        validate: {
          min: 1,
          max: 5,
        },
      },
      review_text: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      response_text: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      review_date: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      updated_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
        onUpdate: DataTypes.NOW,
      },
    });
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('Reviews');
  }
};
