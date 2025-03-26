const { Op } = require('sequelize');
const bcrypt = require('bcrypt');
const JWTService = require('../services/JWTService');

const FAKE_TEMP_USER = {
  id: 1,
  email: 'drummer.sivcan@gmail.com',
  username: 'Sivcan',
  password: bcrypt.hashSync('aptible-test-user-0x', 10)
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
      const user = await Promise.resolve(FAKE_TEMP_USER);

      if (user.length === 0) {
        return reply.code(401).send({
          success: false,
          result: 'Invalid email/username or password'
        });
      }

      let isPasswordValid;

      try {
        isPasswordValid = await bcrypt.compare(password, user.password);
      }
      catch {
        return reply.code(401).send({
          success: false,
          result: 'Invalid email/username or password'
        });
      }

      if (!isPasswordValid) {
        return reply.code(401).send({
          success: false,
          result: 'Invalid email/username or password'
        });
      }

      const token = JWTService.generateToken(user);

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
