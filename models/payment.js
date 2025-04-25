module.exports = (sequelize, DataTypes) => {
  const Payment = sequelize.define('Payment', {
    payment_method: {
      type: DataTypes.ENUM('paypal', 'cbe_birr', 'hellocash', 'amole'),
      allowNull: false,
    },
    payment_date: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
    },
    status: {
      type: DataTypes.ENUM('pending', 'completed', 'failed', 'refunded'),
      allowNull: false,
    },
  }, {
    tableName: 'Payments', // Explicit table name for clarity
    timestamps: false,     // Since no `createdAt` or `updatedAt` are required for payments
  });

  // Associations
  Payment.associate = function(models) {
    // A payment belongs to a transaction
    Payment.belongsTo(models.Transaction, { foreignKey: 'transaction_id', onDelete: 'CASCADE' });
  };

  return Payment;
};
