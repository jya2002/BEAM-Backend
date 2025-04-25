module.exports = (sequelize, DataTypes) => {
  const Review = sequelize.define('Review', {
    rating: {
      type: DataTypes.TINYINT.UNSIGNED,
      allowNull: false,  // Ensure that a rating is always provided
      validate: {
        min: 1,  // Minimum rating value
        max: 5,  // Maximum rating value
      },
    },
    review_text: {
      type: DataTypes.TEXT,
      allowNull: true,  // Allows an empty review text if no description is provided
    },
    review_date: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),  // Automatically sets the current date and time
    },
  }, {
    tableName: 'Reviews', // Explicit table name for clarity
    timestamps: false,     // No `createdAt` or `updatedAt` needed for reviews, as `review_date` is sufficient
  });

  // Associations
  Review.associate = function(models) {
    // A review belongs to a transaction
    Review.belongsTo(models.Transaction, { foreignKey: 'transaction_id', onDelete: 'CASCADE' });

    // A review is made by a reviewer (user) and is for a reviewee (user)
    Review.belongsTo(models.User, { foreignKey: 'reviewer_id', onDelete: 'SET NULL' });
    Review.belongsTo(models.User, { foreignKey: 'reviewee_id', onDelete: 'SET NULL' });
  };

  return Review;
};
