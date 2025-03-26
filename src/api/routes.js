const UserController = require("./controllers/UserController");

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

  next();
};
