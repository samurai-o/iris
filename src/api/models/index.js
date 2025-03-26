// Import lodash utility library
const _ = require("lodash"),
  Sequelize = require("sequelize");
const getModel = require("../helpers/getModel");

const Models = {
  File: require("./File")
};

module.exports = {
  // Function to initialize the database connection
  initialize: function () {
    const dbConfig = app.config.db;

    // Create and return a new Sequelize instance with the database configuration
    return new Sequelize(
      dbConfig.database,
      dbConfig.username,
      dbConfig.password,
      {
        host: dbConfig.host,
        port: dbConfig.port,
        dialect: "postgres",
        dialectOptions: dbConfig.ssl && {
          ssl: {
            require: dbConfig.ssl,
            rejectUnauthorized: false,
          },
        },
      }
    );
  },

  // Function to initialize all the models
  initializeModels: function (sequelize, DataTypes) {
    // Iterate through each model in the Models object
    _.forEach(Models, (Model, key) => {
      // Initialize each model with the sequelize instance and DataTypes
      Models[key] = Model(sequelize, DataTypes);
    });
  },
};
