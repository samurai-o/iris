const { Op } = require('sequelize');
const FileRepository = require("../repositories/FileRepository");
const ACLMap = require("../constants/enums/ACLMap");
const ACLService = require('../services/ACLService');

module.exports = {
  /**
   * Get the resources for a user
   * 
   * @param {Object} user - The user object
   * @returns {Array} The resources for the user
   */
  getUserEnvironmentResources: async function (user) {
    const files = await FileRepository.findAll({
      where: {
        environment_id: {
          [Op.in]: user.environments,
        },
      },
      attributes: ['id', 'environment_id'],
    });

    let resources = files.map(file => {
      return {
        id: file.id,
        environmentId: file.environment_id,
        type: ACLMap.FILE,
      };
    });

    return resources;
  },

  /**
   * Get the permissions for a user after computing the permissions
   * based on the user's role and the environment id for all 
   * the entities the user has access to.
   * 
   * @param {Object} user - The user object
   * @returns {Array} The permissions for the user
   */
  getPermissions: async function (user) {
    const resources = await this.getUserEnvironmentResources(user);

    // We're assuming that the user has the same permissions for all the resources
    // This will later be replaced with a more complex permission model and DB model calls
    const permissions = {};

    resources.forEach(resource => {
      permissions[ACLService.getFileKey(resource.environmentId, resource.id)] = true;
      permissions[ACLService.getEnvironmentKey(resource.environmentId)] = true;
    });

    // Environment level access
    user.environments.forEach(environmentId => {
      permissions[ACLService.getEnvironmentKey(environmentId)] = true;
    });

    // System level access - only based on the user's role and if it's an aptible system user
    // Note: user !== humans. user is an aptible client which can access the system - could be a human or a machine.
    // permissions[ACLService.getSystemReadKey()] = true;
    // permissions[ACLService.getSystemWriteKey()] = true;

    return permissions;
  }
};
