const ACLMap = require("../constants/enums/ACLMap");
const ACLService = require("../services/ACLService");

/**
 * Validate the authorization of the user
 * 
 * @param {Object} request - The request object
 * @param {Object} reply - The reply object
 * @param {Function} next - The next function
 */
module.exports = function (request, reply, next) {
  try {
    const permissions = request.user.permissions;

    const environmentId = request.params.environment_id;
    const fileId = request.params.file_id;

    const fileKey = ACLService.getFileKey(environmentId, fileId);
    const environmentKey = ACLService.getEnvironmentKey(environmentId);
    const systemReadKey = ACLService.getSystemReadKey();
    const systemWriteKey = ACLService.getSystemWriteKey();

    // Allow aptible's internal system access to all resources
    if (permissions[systemReadKey] || permissions[systemWriteKey]) {
      return next();
    }

    // If environmentId is provided, check if the user has access to the environment
    if (environmentId && !permissions[environmentKey]) {
      return reply.code(403).send({ success: false, result: "Forbidden" });
    }

    // If fileId is provided, check if the user has access to the file
    if (fileId && !permissions[fileKey]) {
      return reply.code(403).send({ success: false, result: "Forbidden" });
    }

    next();
  } catch (error) {
    console.log({ error });

    return reply.code(401).send({ success: false, result: "Unauthorized" });
  }
};

