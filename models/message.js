const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Message extends Model {}

  Message.init(
    {
      message_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      sender_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
      },
      receiver_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
      },
      message_text: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      message_date: {
        type: DataTypes.DATE,
        allowNull: false
      },
      
      is_read: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      is_deleted: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      attachment_path: {
        type: DataTypes.STRING(255),
        defaultValue: null,
      },
    },
    {
      sequelize,
      modelName: 'Message',
      tableName: 'Messages',
      timestamps: false, // No createdAt/updatedAt fields by default, same as your SQL
    }
  );

  // Associations (for foreign keys)
  Message.associate = (models) => {
    // A message belongs to a sender (User)
    Message.belongsTo(models.User, {
      foreignKey: 'sender_id',
      as: 'sender', // Alias for the sender relationship
    });

    // A message belongs to a receiver (User)
    Message.belongsTo(models.User, {
      foreignKey: 'receiver_id',
      as: 'receiver', // Alias for the receiver relationship
    });
  };

  return Message;
};
