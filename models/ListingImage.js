module.exports = (sequelize, DataTypes) => {
  const ListingImage = sequelize.define('ListingImage', {
    image_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      primaryKey: true,
      autoIncrement: true,
    },
    listing_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      references: {
        model: 'Listings', // Matches the table name of the Listing model
        key: 'listing_id',
      },
      onDelete: 'CASCADE',
    },
    image_path: {
      type: DataTypes.STRING(255),
      allowNull: false,
      comment: 'Relative path to the uploaded image file',
    },
  }, {
    tableName: 'ListingImages',
    timestamps: false, // Disable createdAt/updatedAt for simplicity
  });

  // Define association inside associate function
  ListingImage.associate = (models) => {
    ListingImage.belongsTo(models.Listing, {
      foreignKey: 'listing_id',
      onDelete: 'CASCADE',
    });
  };

  return ListingImage;
};

  
