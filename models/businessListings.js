module.exports = (sequelize, DataTypes) => {
  const BusinessListing = sequelize.define('BusinessListing', {
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
    tableName: 'BusinessListings',
    timestamps: true,  // Assuming you want to track created_at and updated_at
  });

  // Associations
  BusinessListing.associate = function(models) {
    BusinessListing.belongsTo(models.User, { foreignKey: 'user_id', onDelete: 'CASCADE' });
    BusinessListing.belongsTo(models.Location, { foreignKey: 'location_id', onDelete: 'SET NULL' });
    BusinessListing.hasMany(models.Message, { foreignKey: 'business_listing_id', onDelete: 'CASCADE' });
  };

  return BusinessListing;
};
