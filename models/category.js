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
    },
    is_deleted: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  }, {
    tableName: 'Categories',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  });

  Category.associate = (models) => {
    Category.belongsTo(models.Category, {
      foreignKey: 'parent_id',
      as: 'parentCategory',
      onDelete: 'SET NULL',
    });

    Category.hasMany(models.Category, {
      foreignKey: 'parent_id',
      as: 'childCategories',
    });

    if (models.Subcategory) {
      Category.hasMany(models.Subcategory, {
        foreignKey: 'category_id',
        onDelete: 'CASCADE',
      });
    }
  };

  return Category;
};
