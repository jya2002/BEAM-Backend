// models/ListingImage.js
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
          model: 'Listings',  // Table name for Listings
          key: 'listing_id',
        },
        onDelete: 'CASCADE',
      },
      image_path: {
        type: DataTypes.STRING(255),
        allowNull: false,
        comment: 'Path to the image file',
      },
    }, {
      tableName: 'ListingImages',
      timestamps: false, // We don't need createdAt and updatedAt for images in this case
    });
  
    // Associations
    ListingImage.associate = (models) => {
      ListingImage.belongsTo(models.Listing, {
        foreignKey: 'listing_id',
        onDelete: 'CASCADE',
      });
    };
  
    return ListingImage;
  };
  