module.exports = (sequelize, DataTypes) => {
  const Favorite = sequelize.define('Favorite', {
    favorite_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    user_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
    },
    listing_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
    },
    added_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
    },
  }, {
    tableName: 'Favorites',
    timestamps: false,
    indexes: [
      {
        unique: true,
        fields: ['user_id', 'listing_id'],
        name: 'unique_favorite',
      }
    ],
  });

  Favorite.associate = function(models) {
    Favorite.belongsTo(models.User, {
      foreignKey: 'user_id',
      onDelete: 'CASCADE',
    });

    Favorite.belongsTo(models.Listing, {
      foreignKey: 'listing_id',
      onDelete: 'CASCADE',
    });
  };

  return Favorite;
};
