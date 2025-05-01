module.exports = (sequelize, DataTypes) => {
  const Payment = sequelize.define('Payment', {
    payment_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    user_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id',
      },
    },
    transaction_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      unique: true,
      references: {
        model: 'Transactions',
        key: 'transaction_id',
      },
    },
    payment_method: {
      type: DataTypes.ENUM('paypal', 'cbe_birr', 'hellocash', 'amole'),
      allowNull: false,
    },
    payment_status: {
      type: DataTypes.ENUM('pending', 'completed', 'failed'),
      allowNull: false,
    },
    amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    currency: {
      type: DataTypes.STRING(3),
      allowNull: false,
      defaultValue: 'ETB',
    },
    reference_number: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    payment_date: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
    },
  }, {
    tableName: 'Payments',
    timestamps: false,
  });

  Payment.associate = (models) => {
    Payment.belongsTo(models.User, { foreignKey: 'user_id', onDelete: 'CASCADE' });
    Payment.belongsTo(models.Transaction, { foreignKey: 'transaction_id', onDelete: 'CASCADE' });
  };

  return Payment;
};
