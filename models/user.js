const { DataTypes } = require('sequelize');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

module.exports = (sequelize) => {
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
          is: /^[0-9]{9}$/, // Only 9 digits
        },
        comment: 'Last 9 digits of the phone number, assumes "+251" prefix.',
      },
      is_verified: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        comment: 'Indicates if the user email is verified.',
      },
      notification_token: {
        type: DataTypes.STRING(255),
        defaultValue: null,
        comment: 'Token for push notifications.',
      },
      deletedAt: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: 'Timestamp for soft deletion of the user.',
      },
      createdAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        field: 'createdAt',
      },
      updatedAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        field: 'updatedAt',
      },
    },
    {
      tableName: 'Users',
      timestamps: true,
      paranoid: true,
      hooks: {
        beforeCreate: async (user) => {
          if (user.password) {
            user.password = await bcrypt.hash(user.password, 10);
          }
        },
        beforeUpdate: async (user) => {
          if (user.changed('password')) {
            user.password = await bcrypt.hash(user.password, 10);
          }
        },
      },
      indexes: [
        {
          unique: true,
          fields: ['email'],
        },
        {
          unique: true,
          fields: ['phone_number'],
        },
      ],
    }
  );

  // Find user by email
  User.findByEmail = async function (email) {
    return await this.findOne({ where: { email } });
  };

  // Verify email
  User.verifyEmail = async function (userId) {
    const user = await this.findByPk(userId);
    if (user) {
      user.is_verified = true;
      await user.save();
    }
    return user;
  };

  // Update password
  User.updatePassword = async function (userId, newPassword) {
    const user = await this.findByPk(userId);
    if (user) {
      user.password = await bcrypt.hash(newPassword, 10);
      await user.save();
    }
    return user;
  };

  // Check if the provided password is valid
  User.prototype.isValidPassword = async function (plainPassword) {
    return await bcrypt.compare(plainPassword, this.password);
  };

  // Generate a JSON Web Token
  User.prototype.generateAuthToken = function () {
    return jwt.sign(
      { id: this.id, email: this.email },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );
  };

  return User;
};
