module.exports = (sequelize, DataTypes) => {
  const Location = sequelize.define(
    'Location',
    {
      location_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: { msg: 'Location name cannot be empty.' },
        },
      },
      latitude: {
        type: DataTypes.DECIMAL(9, 6),
        allowNull: true,
        validate: {
          isDecimal: { msg: 'Latitude must be a valid decimal number.' },
          min: { args: [3], msg: 'Latitude must be between 3°N and 15°N.' },
          max: { args: [15], msg: 'Latitude must be between 3°N and 15°N.' },
        },
      },
      longitude: {
        type: DataTypes.DECIMAL(9, 6),
        allowNull: true,
        validate: {
          isDecimal: { msg: 'Longitude must be a valid decimal number.' },
          min: { args: [33], msg: 'Longitude must be between 33°E and 48°E.' },
          max: { args: [48], msg: 'Longitude must be between 33°E and 48°E.' },
        },
      },
      address: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: {
          len: { args: [5, 255], msg: 'Address must be between 5 and 255 characters.' },
        },
      },
      sub_city: {
        type: DataTypes.STRING,
        allowNull: false, // Enforce NOT NULL for sub-city
        validate: {
          len: { args: [2, 100], msg: 'Sub-city name must be between 2 and 100 characters.' },
        },
      },
      kebele: {
        type: DataTypes.STRING,
        allowNull: false, // Enforce NOT NULL for kebele
        validate: {
          len: { args: [1, 50], msg: 'Kebele name must be between 1 and 50 characters.' },
        },
      },
      city: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: 'Addis Ababa',
      },
      country: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'Ethiopia',
      },
    },
    {
      indexes: [
        { name: 'idx_lat_lng', fields: ['latitude', 'longitude'] },
        { name: 'idx_city', fields: ['city'] },
        {
          name: 'unique_name_city',
          unique: true,
          fields: ['name', 'city'], // Ensuring uniqueness of location names within the same city
        },
      ],
      timestamps: true, // Enables createdAt and updatedAt
      createdAt: 'created_at', // Custom column names for created and updated timestamps
      updatedAt: 'updated_at',
    }
  );

  Location.associate = (models) => {
    // Define relationships with other models (for example, Listing model)
    Location.hasMany(models.Listing, {
      foreignKey: 'location_id',
      onDelete: 'SET NULL', // Ensures Listings are not deleted if a Location is removed
    });
  };

  return Location;
};
