const { Op } = require('sequelize');
const FileRepository = require("../repositories/FileRepository");
const ACLMap = require("../constants/enums/ACLMap");
const ACLService = require('../services/ACLService');

/**
 * Map of organization id to environment id and role to permissions
 * 
 * Ideally this would be a DB call to get the role permissions for the organization
 * But can be extended into a more complex model with objects, object groups etc.
 */
const mockedOrganizationRolePermissionsMap = {
  // Organization ID -> Environment ID -> Role -> Permissions
  1: {
    // Environment ID -> Role -> Permissions
    1: {
      // Role -> Permissions
      'Environment Admin': {
        id: 1,
        permissions: [ACLService.getSystemReadKey(), ACLService.getSystemWriteKey()]
      },
      'Full Visibility': {
        id: 2,
        permissions: [ACLService.getFileReadKey(1, 12), ACLService.getFileWriteKey(1, 12), ACLService.getEnvironmentReadKey(1), ACLService.getEnvironmentWriteKey(1)]
      },
      'Deployment': {
        id: 3,
        permissions: [ACLService.getFileReadKey(1, 1), ACLService.getFileWriteKey(1, 1), ACLService.getEnvironmentReadKey(1)]
      },
      'Destruction': {
        id: 4,
        permissions: [ACLService.getFileDeleteKey(1, 1)]
      },
      'Ops': {
        id: 5,
        permissions: [ACLService.getFileReadKey(1, 1), ACLService.getFileWriteKey(1, 1)]
      },
      'Sensitive Access': {
        id: 6,
        permissions: [ACLService.getFileReadKey(1, 1)]
      },
      'Tunnel': {
        id: 7,
        permissions: [ACLService.getFileReadKey(1, 1)]
      }
    },
    2: {
      'Environment Admin': {
        id: 1,
        permissions: [ACLService.getSystemReadKey(), ACLService.getSystemWriteKey()]
      },
      'Full Visibility': {
        id: 2,
        permissions: [ACLService.getFileReadKey(2, 1), ACLService.getFileWriteKey(2, 1), ACLService.getEnvironmentReadKey(2), ACLService.getEnvironmentWriteKey(2)]
      },
      'Deployment': {
        id: 3,
        permissions: [ACLService.getFileReadKey(2, 1), ACLService.getFileWriteKey(2, 1), ACLService.getEnvironmentReadKey(2)]
      },
      'Destruction': {
        id: 4,
        permissions: [ACLService.getFileDeleteKey(2, 1)]
      },
      'Ops': {
        id: 5,
        permissions: [ACLService.getFileReadKey(2, 1), ACLService.getFileWriteKey(2, 1)]
      },
      'Sensitive Access': {
        id: 6,
        permissions: [ACLService.getFileReadKey(2, 1)]
      },
      'Tunnel': {
        id: 7,
        permissions: [ACLService.getFileReadKey(2, 1)]
      }
    }
  }
};

// Function to get permissions based on role
async function getPermissionsByRole(user) {
  const roles = user.roles;
  const organizationId = user.organizationId;
  const environments = user.environments;

  const permissionsSet = new Set();

  environments.forEach(environmentId => {
    const environmentRolePermissions = mockedOrganizationRolePermissionsMap[organizationId]?.[environmentId];

    roles.forEach(role => {
      const rolePermissions = environmentRolePermissions?.[role] || [];

      rolePermissions?.permissions?.forEach(permission => permissionsSet.add(permission));
    });
  });

  return Promise.resolve(Array.from(permissionsSet));
}

function hasSystemAccess(rolePermissions) {
  return rolePermissions.includes(ACLService.getSystemReadKey()) || rolePermissions.includes(ACLService.getSystemWriteKey());
}

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
    const rolePermissions = await getPermissionsByRole(user);

    // const resources = await this.getUserEnvironmentResources(user);

    // const permissions = {};

    // // System level access checks
    // if (hasSystemAccess(rolePermissions)) {
    //   // System level access
    //   rolePermissions.includes(ACLService.getSystemReadKey()) && (permissions[ACLService.getSystemReadKey()] = true);
    //   rolePermissions.includes(ACLService.getSystemWriteKey()) && (permissions[ACLService.getSystemWriteKey()] = true);
    // }

    // // Object level access
    // resources.forEach(resource => {
    //   // Check if the role permissions include the necessary permissions for the resource
    //   if (rolePermissions.includes(ACLService.getFileReadKey(resource.environmentId, resource.id))) {
    //     permissions[ACLService.getFileReadKey(resource.environmentId, resource.id)] = true;
    //   }

    //   if (rolePermissions.includes(ACLService.getFileWriteKey(resource.environmentId, resource.id))) {
    //     permissions[ACLService.getFileWriteKey(resource.environmentId, resource.id)] = true;
    //   }
    // });

    // // Environment level access
    // user.environments.forEach(environmentId => {
    //   if (rolePermissions.includes(ACLService.getEnvironmentReadKey(environmentId))) {
    //     permissions[ACLService.getEnvironmentReadKey(environmentId)] = true;
    //   }

    //   if (rolePermissions.includes(ACLService.getEnvironmentWriteKey(environmentId))) {
    //     permissions[ACLService.getEnvironmentWriteKey(environmentId)] = true;
    //   }
    // });

    // System level access - only based on the user's role and if it's an aptible system user
    // Note: user !== humans. user is an aptible client which can access the system - could be a human or a machine.
    // permissions[ACLService.getSystemReadKey()] = true;
    // permissions[ACLService.getSystemWriteKey()] = true;

    return rolePermissions?.reduce((acc, permission) => {
      acc[permission] = true;
      return acc;
    }, {});
  }
};
