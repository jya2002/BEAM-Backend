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
      refreshTokenVersion: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
        comment: 'Used to invalidate refresh tokens globally.',
      },
      last_login_ip: {
        type: Sequelize.STRING(45),
        allowNull: true,
        comment: 'IP address from the most recent login.',
      },
      deleted_at: {
        type: Sequelize.DATE,
        allowNull: true,
        comment: 'Soft delete timestamp.',
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
    });

    // Indexes
    await queryInterface.addIndex('Users', ['email'], { unique: true });
    await queryInterface.addIndex('Users', ['phone_number'], { unique: true });
    await queryInterface.addIndex('Users', ['is_verified']);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Users');
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_Users_role";');
  },
};

