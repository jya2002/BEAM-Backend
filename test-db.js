require('dotenv').config(); // always loads .env
const { sequelize } = require('./models'); // adjust path if needed

sequelize.authenticate()
  .then(() => {
    console.log('Using DB config:', {
        user: process.env.DB_USER,
        pass: process.env.DB_PASSWORD,
        host: process.env.DB_HOST,
      });
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Unable to connect to the database:', error);
    process.exit(1);
  });
