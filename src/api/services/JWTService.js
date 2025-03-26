const jwt = require("jsonwebtoken");

const SECRET_KEY = "aptible_secret"; // Replace with env secret vars later
const JWT_EXPIRY_TS = "30m";

module.exports = {
  /**
   * Generate a JWT token.
   *
   * @param {Object} user - User object to encode in the token
   * @returns {String} - JWT token
   */
  generateToken: function (user) {
    return jwt.sign(
      {
        id: user.id,
        email: user.email,
        username: user.username,
      },
      SECRET_KEY,
      {
        expiresIn: JWT_EXPIRY_TS,
      }
    );
  },

  /**
   * Verify a JWT token.
   *
   * @param {String} token - JWT token to verify
   * @returns {Object} - Decoded token payload
   */
  verifyToken: function (token) {
    return jwt.verify(token, SECRET_KEY);
  },
};
