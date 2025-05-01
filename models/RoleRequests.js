module.exports = (sequelize, DataTypes) => {
    const RoleRequest = sequelize.define('RoleRequest', {
      request_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        primaryKey: true,
        autoIncrement: true,
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
      requested_role: {
        type: DataTypes.ENUM('employee', 'admin'),
        allowNull: false,
      },
      status: {
        type: DataTypes.ENUM('pending', 'approved', 'rejected'),
        defaultValue: 'pending',
      },
      rejection_reason: {
        type: DataTypes.TEXT,
        allowNull: true,
        comment: 'Optional reason provided by admin for rejection',
      },
      createdAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
      updatedAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
    }, {
      tableName: 'RoleRequests',
      timestamps: true,
    });
  
    RoleRequest.associate = function (models) {
      RoleRequest.belongsTo(models.User, { foreignKey: 'user_id', onDelete: 'CASCADE' });
    };
  
    return RoleRequest;
  };
  