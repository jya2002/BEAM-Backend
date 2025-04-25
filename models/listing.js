module.exports = (sequelize, DataTypes) => {
  const Listing = sequelize.define('Listing', {
    listing_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      primaryKey: true,
      autoIncrement: true,
    },
    user_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      references: {
        model: 'Users', // Matches the table name
        key: 'id',
      },
    },
    category_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: true,
      references: {
        model: 'Categories',
        key: 'category_id',
      },
    },
    location_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: true,
      references: {
        model: 'Locations',
        key: 'location_id',
      },
    },
    title_am: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    title_en: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description_am: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    description_en: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    image_path: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM('available', 'sold', 'pending'),
      allowNull: false,
    },
    view_count: {
      type: DataTypes.INTEGER.UNSIGNED,
      defaultValue: 0,
    },
  }, {
    tableName: 'Listings',
    timestamps: true, // Enables createdAt and updatedAt
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  });

  Listing.associate = (models) => {
    Listing.belongsTo(models.User, {
      foreignKey: 'user_id',
      onDelete: 'CASCADE',
    });
    Listing.belongsTo(models.Category, {
      foreignKey: 'category_id',
      onDelete: 'SET NULL',
    });
    Listing.belongsTo(models.Location, {
      foreignKey: 'location_id',
      onDelete: 'SET NULL',
    });
    Listing.hasMany(models.Transaction, {
      foreignKey: 'listing_id',
      onDelete: 'CASCADE',
    });
    Listing.hasMany(models.Message, {
      foreignKey: 'listing_id',
      onDelete: 'CASCADE',
    });
    Listing.hasMany(models.Favorite, {
      foreignKey: 'listing_id',
      onDelete: 'CASCADE',
    });
  };

  return Listing;
};
