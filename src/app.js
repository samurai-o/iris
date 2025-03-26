const { DataTypes } = require('sequelize')
config = require('./config/default'),
  models = require('./api/models');

global.app = {
  config: config
}

let _ = require('lodash'),
  fastify = require('fastify')({
    trustProxy: true,
    bodyLimit: 1024 * 1024 * 100, // 100 MB
    logger: true
  });

global.app.fastify = fastify;

fastify.setErrorHandler(function (error, request, reply) {
  if (error.validation) {
    // Format validation errors according to our API response structure
    return reply.status(400).send({
      success: false,
      result: error.message
    });
  }

  // Log non-validation errors
  request.log.error(error);

  // Handle other types of errors
  reply.status(500).send({
    success: false,
    result: 'Internal Server Error'
  });
});

// IIFE to initialize server
(async () => {
  try {
    /*
    * Registering fastify-express plugin to use express middleware in fastify
    */
    await fastify.register(require('fastify-express'));

    // Register multipart support
    await fastify.register(require('@fastify/multipart'), {
      limits: {
        fieldNameSize: 100, // Max field name size in bytes
        fieldSize: 100, // Max field value size in bytes
        fields: 10,     // Max number of non-file fields
        fileSize: 100 * 1024 * 1024, // For multipart forms, the max file size in bytes (100mb) - we can change it as needed
        files: 10,      // Max number of file fields
        headerPairs: 2000 // Max number of header key=>value pairs
      }
    });

    /*
    * Registering routes
    */
    await fastify.register(require('./api/routes'));

    // Initialize sequelize ORM
    global.app.sequelize = models.initialize();

    // Authenticate the DB and connect it
    await global.app.sequelize.authenticate();

    console.log('Connection to the database has been established successfully.');

    // Initialize the sequelize models
    models.initializeModels(app.sequelize, DataTypes);

    /*
    * Starting the server
    */
    const address = await fastify.listen({ port: global.app.config.port, host: '0.0.0.0' });

    console.log(`Server lifted at address ${address}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
})();