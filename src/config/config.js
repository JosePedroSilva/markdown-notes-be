// server/src/config/config.js
const path = require('path');

module.exports = {
  development: {
    dialect: 'sqlite',
    storage: path.resolve(__dirname, '..', '..', 'database.db'),
  },
  test: {
    dialect: 'sqlite',
    storage: ':memory:',
  },
  production: {
    dialect: 'sqlite',
    storage: path.resolve(__dirname, '..', '..', 'database.db'),
  },
};
