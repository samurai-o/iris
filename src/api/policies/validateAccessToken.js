const JWTService = require("../services/JWTService");

/**
 * Set the user object on the request
 * 
 * @param {Object} request - The request object
 * @param {Object} decoded - The decoded token
 */
function setUser(request, decoded) {
  request.user = decoded;
}

/**
 * Set the active environment from the decoded token and the request params
 * 
 * @param {Object} request - The request object
 * @param {Object} decoded - The decoded token
 * @returns {Object} The active environment
 */
function setActiveEnvironment(request) {
  const user = request.user;
  const environmentId = parseInt(request.params.environment_id);

  const activeEnvironment = user?.environments?.find(
    (environment) => environment === environmentId
  ) || user?.environments?.[0];

  // Set the active aptible environment on the user object
  user.activeEnvironment = activeEnvironment;
}

module.exports = function (request, reply, next) {
  const headers = request.headers;

  if (!headers.authorization) {
    return reply.code(401).send({ success: false, result: "Unauthorized" });
  }

  const token = headers.authorization.split(" ")[1];

  try {
    const decoded = JWTService.verifyToken(token);

    if (!decoded) {
      return reply.code(401).send({ success: false, result: "Unauthorized" });
    }

    setUser(request, decoded);
    setActiveEnvironment(request);

    next();
  } catch (error) {
    console.log({ error });

    return reply.code(401).send({ success: false, result: "Unauthorized" });
  }
};
