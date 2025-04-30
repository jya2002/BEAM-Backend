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
      hooks: {
        beforeCreate: async (user) => {
          try {
            if (user.password) {
              const saltRounds = 12;  // Adjust salt rounds for stronger security
              user.password = await bcrypt.hash(user.password, saltRounds);
            }
          } catch (err) {
            throw new Error('Error while hashing password during creation');
          }
        },
        beforeUpdate: async (user) => {
          try {
            if (user.changed('password')) {
              const saltRounds = 12;  // Ensure to hash the new password with the same salt rounds
              user.password = await bcrypt.hash(user.password, saltRounds);
            }
          } catch (err) {
            throw new Error('Error while hashing password during update');
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
    const user = await this.findOne({ where: { email } });
    if (!user) {
      throw new Error('User not found');
    }
    return user;
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
      const saltRounds = 12;
      user.password = await bcrypt.hash(newPassword, saltRounds);
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
    if (!process.env.JWT_SECRET) {
      throw new Error('JWT_SECRET is not defined in the environment variables');
    }
    const accessToken = jwt.sign(
      { id: this.id, email: this.email },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );
    const refreshToken = jwt.sign(
      { id: this.id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
    return { accessToken, refreshToken };
  };

  return User;
};
