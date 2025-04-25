const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Category = sequelize.define('Category', {
    category_id: {
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
    parent_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: true,
      references: {
        model: 'Categories', // Self-referencing foreign key
        key: 'category_id',
      },
      onDelete: 'SET NULL',
    },
    is_deleted: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      onUpdate: DataTypes.NOW,
    },
  }, {
    tableName: 'Categories', // Matches the table name in the database
    timestamps: false,        // Disables automatic timestamp management by Sequelize
  });

  // Define associations
  Category.associate = (models) => {
    // Self-referencing association: A category can have a parent category
    Category.belongsTo(models.Category, {
      foreignKey: 'parent_id',
      as: 'parentCategory',
      onDelete: 'SET NULL',
    });

    // Self-referencing association: A category can have child categories
    Category.hasMany(models.Category, {
      foreignKey: 'parent_id',
      as: 'childCategories',
    });

    // Association with Subcategories: A category can have many subcategories
    Category.hasMany(models.Subcategory, {
      foreignKey: 'category_id',
      onDelete: 'CASCADE',
    });
  };

  return Category;
};
