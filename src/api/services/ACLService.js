const ACLMap = require("../constants/enums/ACLMap");

module.exports = {
  getFileKey: function (environmentId, fileId) {
    return `${ACLMap.ENVIRONMENT}:${environmentId}:${ACLMap.FILE}:${fileId}:${ACLMap.READ}`;
  },

  getEnvironmentKey: function (environmentId) {
    return `${ACLMap.ENVIRONMENT}:${environmentId}:${ACLMap.ENVIRONMENT}:${ACLMap.READ}`;
  },

  getSystemReadKey: function () {
    return `${ACLMap.SYSTEM}:${ACLMap.READ}`;
  },

  getSystemWriteKey: function () {
    return `${ACLMap.SYSTEM}:${ACLMap.WRITE}`;
  },
};