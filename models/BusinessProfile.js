module.exports = (sequelize, DataTypes) => {
    const BusinessProfile = sequelize.define('BusinessProfile', {
      business_id: {
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
      },
      company_name: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      license_number: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      website: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      phone_number: {
        type: DataTypes.CHAR(9),
        allowNull: true,
      },
      sub_city: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      woreda: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      house_number: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
    }, {
      tableName: 'BusinessProfiles',
      timestamps: true,
    });
  
    BusinessProfile.associate = function(models) {
      BusinessProfile.belongsTo(models.User, { foreignKey: 'user_id', onDelete: 'CASCADE' });
    };
  
    return BusinessProfile;
  };
  