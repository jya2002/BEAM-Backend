
module.exports = (sequelize, DataTypes) => {
  const Review = sequelize.define('Review', {
    rating: {
      type: DataTypes.TINYINT.UNSIGNED,
      allowNull: false,
      validate: {
        min: 1,
        max: 5,
      },
    },
    review_text: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    review_date: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
    },
    response_text: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
      onUpdate: sequelize.literal('CURRENT_TIMESTAMP'),
    },
  }, {
    tableName: 'Reviews',
    timestamps: false,
  });

  // Associations
  Review.associate = function(models) {
    Review.belongsTo(models.User, { foreignKey: 'buyer_id', onDelete: 'CASCADE' });
    Review.belongsTo(models.User, { foreignKey: 'seller_id', onDelete: 'CASCADE' });
    Review.belongsTo(models.Listing, { foreignKey: 'listing_id', onDelete: 'CASCADE' });
    Review.belongsTo(models.Transaction, { foreignKey: 'transaction_id', onDelete: 'CASCADE' });
  };

  return Review;
};
