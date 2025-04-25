module.exports = (sequelize, DataTypes) => {
  const Favorite = sequelize.define('Favorite', {
    added_at: {
      type: DataTypes.DATE, // Change to DataTypes.DATE
      allowNull: false,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
    },
  }, {
    tableName: 'Favorites', // Explicitly define the table name (optional)
    timestamps: false,      // Disable timestamps if not needed
  });

  // Associations
  Favorite.associate = function(models) {
    // A favorite belongs to a user
    Favorite.belongsTo(models.User, { foreignKey: 'user_id', onDelete: 'CASCADE' });

    // A favorite belongs to a listing
    Favorite.belongsTo(models.Listing, { foreignKey: 'listing_id', onDelete: 'CASCADE' });
  };

  return Favorite;
};
