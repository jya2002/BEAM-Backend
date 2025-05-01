// models/BusinessListingImage.js
module.exports = (sequelize, DataTypes) => {
    const BusinessListingImage = sequelize.define('BusinessListingImage', {
      image_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        primaryKey: true,
        autoIncrement: true,
      },
      business_listing_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        references: {
          model: 'BusinessListings',  // Table name for BusinessListings
          key: 'business_listing_id',
        },
        onDelete: 'CASCADE',
      },
      image_path: {
        type: DataTypes.STRING(255),
        allowNull: false,
        comment: 'Path to the image file',
      },
    }, {
      tableName: 'BusinessListingImages',
      timestamps: false, // We don't need createdAt and updatedAt for images in this case
    });
  
    // Associations
    BusinessListingImage.associate = (models) => {
      BusinessListingImage.belongsTo(models.BusinessListing, {
        foreignKey: 'business_listing_id',
        onDelete: 'CASCADE',
      });
    };
  
    return BusinessListingImage;
  };
  