'use strict';

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    'User',
    {
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        primaryKey: true,
        autoIncrement: true,
      },
      full_name: {
        type: DataTypes.STRING(200),
        allowNull: false,
        comment: 'Full name of the user.',
      },
      email: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true,
        validate: {
          isEmail: true,
        },
        comment: 'User email, must be unique.',
      },
      password: {
        type: DataTypes.STRING(255),
        allowNull: false,
        comment: 'Hashed user password.',
      },
      phone_number: {
        type: DataTypes.CHAR(9),
        allowNull: false,
        unique: true,
        validate: {
          isNineDigits(value) {
            if (!/^\d{9}$/.test(value)) {
              throw new Error('Phone number must be exactly 9 digits.');
            }
          },
        },
        comment: 'Last 9 digits of the phone number (assumes +251).',
      },
      role: {
        type: DataTypes.ENUM('user', 'employee', 'admin'),
        allowNull: false,
        defaultValue: 'user',
        comment: 'User role for access control.',
      },
      is_verified: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        comment: 'Indicates if the user email is verified.',
      },
      notification_token: {
        type: DataTypes.STRING(255),
        allowNull: true,
        comment: 'Token for push notifications.',
      },
      refreshTokenVersion: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        allowNull: false,
        comment: 'Used to invalidate refresh tokens globally.',
      },
      last_login_ip: {
        type: DataTypes.STRING(45),
        allowNull: true,
        comment: 'IP address from the most recent login.',
      },
      deletedAt: {
        type: DataTypes.DATE,
        allowNull: true,
        field: 'deleted_at',
        comment: 'Soft delete timestamp.',
      },
      createdAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        field: 'created_at',
      },
      updatedAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        field: 'updated_at',
      },
    },
    {
      tableName: 'Users',
      timestamps: true,
      paranoid: true,
      defaultScope: {
        attributes: { exclude: ['password'] },
      },
      hooks: {
        beforeCreate: async (user) => {
          try {
            if (user.email) user.email = user.email.trim().toLowerCase();
            if (user.password) {
              const saltRounds = 12;
              user.password = await bcrypt.hash(user.password, saltRounds);
            }
          } catch (err) {
            throw new Error('Error while hashing password during creation');
          }
        },
        beforeUpdate: async (user) => {
          try {
            if (user.changed('email')) {
              user.email = user.email.trim().toLowerCase();
            }
            if (user.changed('password')) {
              const saltRounds = 12;
              user.password = await bcrypt.hash(user.password, saltRounds);
            }
          } catch (err) {
            throw new Error('Error while hashing password during update');
          }
        },
      },
      indexes: [
        { unique: true, fields: ['email'] },
        { unique: true, fields: ['phone_number'] },
        { fields: ['is_verified'] },
      ],
    }
  );

  // Remove sensitive fields like password before sending to client
  User.prototype.toJSON = function () {
    const values = { ...this.get() };
    delete values.password;
    return values;
  };

  // STATIC METHODS
  User.findByEmail = async function (email) {
    return await this.findOne({ where: { email: email.trim().toLowerCase() } });
  };

  User.findByPhone = async function (phone_number) {
    return await this.findOne({ where: { phone_number } });
  };

  User.verifyEmail = async function (userId) {
    const user = await this.findByPk(userId);
    if (user) {
      user.is_verified = true;
      await user.save();
    }
    return user;
  };

  User.updatePassword = async function (userId, newPassword) {
    const user = await this.findByPk(userId);
    if (user) {
      const saltRounds = 12;
      user.password = await bcrypt.hash(newPassword, saltRounds);
      await user.save();
    }
    return user;
  };

  // INSTANCE METHODS
  User.prototype.isValidPassword = async function (plainPassword) {
    return await bcrypt.compare(plainPassword, this.password);
  };

  User.prototype.generateAuthToken = function () {
    if (!process.env.JWT_SECRET) {
      throw new Error('JWT_SECRET is not defined in the environment variables');
    }

    const accessToken = jwt.sign(
      { id: this.id, email: this.email },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    const refreshToken = jwt.sign(
      { id: this.id, version: this.refreshTokenVersion },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    return {
      accessToken,
      refreshToken,
      expiresIn: 3600, // in seconds (1h)
    };
  };

  return User;
};
