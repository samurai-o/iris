const ACLMap = require("../constants/enums/ACLMap");

module.exports = {
  getFileReadKey: function (environmentId, fileId) {
    return `${ACLMap.ENVIRONMENT}:${environmentId}:${ACLMap.FILE}:${fileId}:${ACLMap.READ}`;
  },

  getFileWriteKey: function (environmentId, fileId) {
    return `${ACLMap.ENVIRONMENT}:${environmentId}:${ACLMap.FILE}:${fileId}:${ACLMap.WRITE}`;
  },

  getFileDeleteKey: function (environmentId, fileId) {
    return `${ACLMap.ENVIRONMENT}:${environmentId}:${ACLMap.FILE}:${fileId}:${ACLMap.DELETE}`;
  },

  getEnvironmentReadKey: function (environmentId) {
    return `${ACLMap.ENVIRONMENT}:${environmentId}:${ACLMap.ENVIRONMENT}:${ACLMap.READ}`;
  },

  getEnvironmentWriteKey: function (environmentId) {
    return `${ACLMap.ENVIRONMENT}:${environmentId}:${ACLMap.ENVIRONMENT}:${ACLMap.WRITE}`;
  },

  getSystemReadKey: function () {
    return `${ACLMap.SYSTEM}:${ACLMap.READ}`;
  },

  getSystemWriteKey: function () {
    return `${ACLMap.SYSTEM}:${ACLMap.WRITE}`;
  },
};