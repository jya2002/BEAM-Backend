module.exports = (sequelize, DataTypes) => {
  const BusinessListing = sequelize.define('BusinessListing', {
    business_listing_id: {  // Primary key for BusinessListings
      type: DataTypes.INTEGER.UNSIGNED,
      primaryKey: true,
      autoIncrement: true,
    },
    user_id: {  // Foreign key for User
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id',  // Assuming the Users table has 'id' as the primary key
      },
    },
    location_id: {  // Foreign key for Location
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: true,
      references: {
        model: 'Locations',
        key: 'location_id',  // Assuming the Locations table has 'location_id' as the primary key
      },
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
    },
    salary_range: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    image_url: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    type: {
      type: DataTypes.ENUM('job', 'property'),
      allowNull: false,
    },
  }, {
    tableName: 'BusinessListings',  // Matches the name of the SQL table
    timestamps: true,  // Assuming you want to track created_at and updated_at timestamps
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  });

  // Associations
  BusinessListing.associate = function(models) {
    BusinessListing.belongsTo(models.User, { 
      foreignKey: 'user_id', 
      onDelete: 'CASCADE',
    });
    BusinessListing.belongsTo(models.Location, { 
      foreignKey: 'location_id', 
      onDelete: 'SET NULL',  // Keep listing even if location is deleted
    });
    BusinessListing.hasMany(models.Message, { 
      foreignKey: 'business_listing_id', 
      onDelete: 'CASCADE',  // Delete messages if BusinessListing is deleted
    });
  };

  return BusinessListing;
};
