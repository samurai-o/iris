const FileController = require("./controllers/FileController");
const UserController = require("./controllers/UserController");
const policies = require("./policies");

module.exports = function (fastify, options, next) {
  fastify.get("/", {
    handler: (request, reply) => {
      reply.code(200).send({ message: "Hello Aptible!" });
    },
  });

  // Login endpoint
  fastify.post("/login", {
    handler: UserController.login
  });

  // Files routes
  fastify.post("/files/:environment_id/upload", {
    preHandler: [policies.validateAccessToken, policies.validateAuthorization],
    handler: FileController.uploadFiles
  });

  // Files routes
  fastify.get("/files/:environment_id/:file_id", {
    preHandler: [policies.validateAccessToken, policies.validateAuthorization],
    handler: FileController.getFile
  });

  next();
};
