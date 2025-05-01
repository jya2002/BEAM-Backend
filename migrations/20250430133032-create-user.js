'use strict';

/** @type {import('sequelize-cli').Migration} */

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Users', {
      id: {
        type: Sequelize.INTEGER.UNSIGNED,
        primaryKey: true,
        autoIncrement: true,
      },
      full_name: {
        type: Sequelize.STRING(200),
        allowNull: false,
        comment: 'Full name of the user.',
      },
      email: {
        type: Sequelize.STRING(100),
        allowNull: false,
        unique: true,
        validate: {
          isEmail: true,
        },
        comment: 'User email, must be unique.',
      },
      password: {
        type: Sequelize.STRING(255),
        allowNull: false,
        comment: 'Hashed user password.',
      },
      phone_number: {
        type: Sequelize.CHAR(9),
        allowNull: false,
        unique: true,
        validate: {
          is: /^[0-9]{9}$/, // 9 digits only
        },
        comment: 'Last 9 digits of the phone number (assumes +251).',
      },
      role: {
        type: Sequelize.ENUM('user', 'employee', 'admin'),
        allowNull: false,
        defaultValue: 'user',
        comment: 'User role for access control.',
      },
      is_verified: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
        comment: 'Indicates if the user email is verified.',
      },
      notification_token: {
        type: Sequelize.STRING(255),
        allowNull: true,
        comment: 'Token for push notifications.',
      },
      deletedAt: {
        type: Sequelize.DATE,
        allowNull: true,
        comment: 'Soft delete timestamp.',
      },
      createdAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
        field: 'created_at',
      },
      updatedAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
        field: 'updated_at',
      },
    });

    // Add indexes
    await queryInterface.addIndex('Users', ['email'], { unique: true });
    await queryInterface.addIndex('Users', ['phone_number'], { unique: true });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Users');
  },
};
