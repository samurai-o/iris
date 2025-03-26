const { Op } = require('sequelize');
const bcrypt = require('bcrypt');
const JWTService = require('../services/JWTService');
const ACLController = require('./ACLController');

/**
 * Get a fake user
 * 
 * @param {String} username - The username of the user
 * @returns {Object} The user object
 */
function getFakeUser(username) {
  const FAKE_TEMP_USER = {
    id: 1,
    email: 'drummer.sivcan@gmail.com',
    username: 'Sivcan',
    roles: ['Environment Admin'],
    // roles: ['Full Visibility'],
    organizationId: 1,
    environments: [1, 2, 3],
    password: bcrypt.hashSync('aptible-test-user-0x', 10)
  };

  return FAKE_TEMP_USER;
};

module.exports = {
  /**
   * Login a user
   *
   * @param {Object} req - Fastify request object
   * @param {Object} reply - Fastify reply object
   */
  login: async function (req, reply) {
    const { username, password } = req.body;

    try {
      // Perform a DB query here to get the user
      const user = await Promise.resolve(getFakeUser(username));

      if (user.length === 0) {
        return reply.code(401).send({
          success: false,
          result: 'Invalid email/username or password'
        });
      }

      let isPasswordValid;

      isPasswordValid = await bcrypt.compare(password, user.password);

      if (!isPasswordValid) {
        return reply.code(401).send({
          success: false,
          result: 'Invalid email/username or password'
        });
      }

      //-- Setup the permissions and generate the JWT token

      // We're collapsing the permissions tree into the JWT token map to avoid DB calls
      // and keep a super fast application layer authorization mechanism.
      // 
      // A later improvement would be to store the permissions separately
      // One basic alternative is to store a session key into the JWT and then
      // map that session key to the permissions in Redis.
      //
      // This approach does have problems though. So for scaling this, we'll need
      // to store the permissions separately in a distributed and eventually consistent 
      // caching system such as Aserto, which will avoid single points of failure.
      const permissions = await ACLController.getPermissions(user);

      const token = await JWTService.generateToken(user, permissions);

      // Remove password from user object before sending response
      delete user.password;

      return reply.code(200).send({
        success: true,
        result: { user, token }
      });
    } catch (error) {
      req.log.error(error);
      return reply.code(500).send({ success: false, result: error.message });
    }
  },
};
