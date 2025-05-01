module.exports = (sequelize, DataTypes) => {
  const Transaction = sequelize.define('Transaction', {
    transaction_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      primaryKey: true,
      autoIncrement: true,
    },
    buyer_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      references: {
        model: 'Users', // Foreign key reference to Users table
        key: 'id',
      },
      onDelete: 'CASCADE',
    },
    seller_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      references: {
        model: 'Users', // Foreign key reference to Users table
        key: 'id',
      },
      onDelete: 'CASCADE',
    },
    listing_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      references: {
        model: 'Listings', // Foreign key reference to Listings table
        key: 'listing_id',
      },
      onDelete: 'CASCADE',
    },
    payment_status: {
      type: DataTypes.ENUM('pending', 'completed', 'failed'),
      allowNull: false, // Payment status is mandatory
    },
    transaction_status: {
      type: DataTypes.ENUM('initiated', 'in_progress', 'completed', 'cancelled', 'disputed'),
      defaultValue: 'initiated',
    },
    transaction_amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false, // Transaction amount is required
    },
    currency: {
      type: DataTypes.STRING(3),
      allowNull: false,
      defaultValue: 'ETB', // Default currency is ETB
    },
    transaction_date: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP'), // Automatically set the timestamp when the transaction is created
    },
    meta: {
      type: DataTypes.JSON,
      allowNull: true, // Optional JSON field for future data
    },
  }, {
    tableName: 'Transactions', // Explicit table name
    timestamps: false, // No `createdAt` or `updatedAt`, as `transaction_date` is the key timestamp
  });

  // Associations
  Transaction.associate = function(models) {
    // A transaction belongs to a listing
    Transaction.belongsTo(models.Listing, { foreignKey: 'listing_id', onDelete: 'CASCADE' });

    // A transaction has a buyer and a seller
    Transaction.belongsTo(models.User, { foreignKey: 'buyer_id', onDelete: 'CASCADE' });
    Transaction.belongsTo(models.User, { foreignKey: 'seller_id', onDelete: 'CASCADE' });

    // A transaction can have multiple payments
    Transaction.hasMany(models.Payment, { foreignKey: 'transaction_id', onDelete: 'CASCADE' });
  };

  return Transaction;
};
