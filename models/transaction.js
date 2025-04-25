module.exports = (sequelize, DataTypes) => {
  const Transaction = sequelize.define('Transaction', {
    amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false, // The transaction amount is required
    },
    delivery_cost: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true, // Delivery cost is optional
    },
    status: {
      type: DataTypes.ENUM('pending', 'completed', 'canceled', 'disputed'),
      allowNull: false, // Transaction status must be specified
    },
    transaction_date: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP'), // Automatically set the timestamp when the transaction is created
    },
  }, {
    tableName: 'Transactions', // Explicit table name for clarity
    timestamps: false, // No `createdAt` or `updatedAt` as transaction date is the key
  });

  // Associations
  Transaction.associate = function(models) {
    // A transaction belongs to a listing
    Transaction.belongsTo(models.Listing, { foreignKey: 'listing_id', onDelete: 'CASCADE' });

    // A transaction has a buyer and a seller
    Transaction.belongsTo(models.User, { foreignKey: 'buyer_id', onDelete: 'SET NULL' });
    Transaction.belongsTo(models.User, { foreignKey: 'seller_id', onDelete: 'SET NULL' });

    // A transaction can have multiple payments
    Transaction.hasMany(models.Payment, { foreignKey: 'transaction_id', onDelete: 'CASCADE' });
  };

  return Transaction;
};
