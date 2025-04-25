const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Subcategory = sequelize.define('Subcategory', {
    subcategory_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      primaryKey: true,
      autoIncrement: true,
    },
    name_am: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    name_en: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    description_am: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    description_en: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    category_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      references: {
        model: 'Categories', // References the Categories table
        key: 'category_id',
      },
      onDelete: 'CASCADE',
    },
    parent_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: true,
      references: {
        model: 'Subcategories', // Self-referencing foreign key
        key: 'subcategory_id',
      },
      onDelete: 'CASCADE',
    },
    is_deleted: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    updated_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      onUpdate: DataTypes.NOW,
    },
  }, {
    tableName: 'Subcategories', // Matches the SQL table name
    timestamps: false, // Disables Sequelize's auto timestamps
  });

  // Define associations
  Subcategory.associate = (models) => {
    // Association with Category
    Subcategory.belongsTo(models.Category, {
      foreignKey: 'category_id',
      as: 'category',
      onDelete: 'CASCADE',
    });

    // Self-referencing association for parent-child relationship
    Subcategory.belongsTo(models.Subcategory, {
      foreignKey: 'parent_id',
      as: 'parentSubcategory',
      onDelete: 'CASCADE',
    });

    // A subcategory can have many child subcategories
    Subcategory.hasMany(models.Subcategory, {
      foreignKey: 'parent_id',
      as: 'childSubcategories',
      onDelete: 'CASCADE',
    });
  };

  return Subcategory;
};
