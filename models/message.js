module.exports = (sequelize, DataTypes) => {
  const Message = sequelize.define('Message', {
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    is_read: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    message_type: {
      type: DataTypes.ENUM('inquiry', 'negotiation', 'other'),
      defaultValue: 'inquiry',
    },
    sent_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
    },
  }, {
    tableName: 'Messages', // Explicit table name
    timestamps: true,       // Enable timestamp management (createdAt, updatedAt)
  });

  // Associations
  Message.associate = function(models) {
    // A message belongs to a sender (User)
    Message.belongsTo(models.User, { foreignKey: 'sender_id', onDelete: 'SET NULL' });

    // A message belongs to a receiver (User)
    Message.belongsTo(models.User, { foreignKey: 'receiver_id', onDelete: 'SET NULL' });

    // A message belongs to a listing
    Message.belongsTo(models.Listing, { foreignKey: 'listing_id', onDelete: 'CASCADE' });

    // A message belongs to a business listing
    Message.belongsTo(models.BusinessListing, { foreignKey: 'business_listing_id', onDelete: 'CASCADE' });
  };

  return Message;
};
