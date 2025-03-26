/**
 * Transaction Service.
 *
 * Primarily handled transaction start, commit, rollback with sequelize
 */
module.exports = {
  /**
   * Start a new transaction.
   *
   * @returns {Promise.<Object>} - sequelize transaction object
   */
  start: async function () {
    return app.sequelize.transaction();
  },

  /**
   * Rollback an existing transaction.
   *
   * @param  {Object} transaction - sequelize transaction object
   * @returns {Promise}
   */
  rollback: async function (transaction) {
    if (!transaction || !transaction.rollback) {
      return Promise.reject(new Error('TransactionService~rollback: Rollback not found'));
    }

    return transaction && transaction.rollback();
  },

  /**
   * Commit an existing transaction.
   *
   * @param  {Object} transaction - sequelize transaction object
   * @returns {Promise}
   */
  commit: async function (transaction) {
    if (!transaction || !transaction.commit) {
      return Promise.reject(new Error('TransactionService~commit: Commit fn not found'));
    }

    return transaction && transaction.commit();
  }
};
