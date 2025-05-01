'use strict';

/** @type {import('sequelize-cli').Migration} */

module.exports = {
  up: async (queryInterface, DataTypes) => {
    await queryInterface.createTable('Payments', {
      payment_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },
      user_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      transaction_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        unique: true,
        references: {
          model: 'Transactions',
          key: 'transaction_id',
        },
        onDelete: 'CASCADE',
      },
      payment_method: {
        type: DataTypes.ENUM('paypal', 'cbe_birr', 'hellocash', 'amole'),
        allowNull: false,
      },
      payment_status: {
        type: DataTypes.ENUM('pending', 'completed', 'failed'),
        allowNull: false,
      },
      amount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      currency: {
        type: DataTypes.STRING(3),
        allowNull: false,
        defaultValue: 'ETB',
      },
      reference_number: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      payment_date: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
    });
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('Payments');
  }
};
