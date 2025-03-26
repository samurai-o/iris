require('dotenv').config();

module.exports = require('env-lift').load('S', {
  port: process.env.PORT || 3000,
  environment: 'development',
  db: {
    host: 'localhost',
    port: 5432,
    database: 'iris',
    username: 'postgres',
    password: 'iris',
    ssl: false
  },
  azure: {
    storage: {
      connectionString: null
    }
  },
});
