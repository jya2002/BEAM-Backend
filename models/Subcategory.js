module.exports = (sequelize, DataTypes) => {
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
      allowNull: false, // Explicitly set to false (matches the SQL schema)
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      allowNull: false, // Ensure it is not nullable, matches SQL schema
    },
    updated_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      allowNull: false, // Ensure it is not nullable, matches SQL schema
      onUpdate: DataTypes.NOW,
    },
  }, {
    tableName: 'Subcategories', // Explicit table name
    timestamps: false,     // Disable automatic timestamps (use `created_at` and `updated_at` instead)
  });

  // Associations
  Subcategory.associate = function (models) {
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
