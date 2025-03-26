const _ = require("lodash");
const getModel = require("../helpers/getModel");

module.exports = {
  /**
   * Create a file record
   *
   * @param {Object} record - file record to be created
   * @param {Object} transaction - sequelize transaction
   *
   * @returns {Promise}
   */
  create: async function (record, transaction) {
    const File = getModel("File");

    if (_.isEmpty(record)) {
      return Promise.reject(
        new Error(
          "FileRepository~create: Mandatory Parameters missing"
        )
      );
    }

    return File.create(record, { transaction });
  },

  /**
   * Find a file record by ID
   *
   * @param {Number} id - ID of the file
   * @returns {Promise}
   */
  findById: async function (id, opts) {
    const File = getModel("File");

    return File.findByPk(id, opts);
  },

  /**
   * Find a file record by clause
   *
   * @param {Object} clause - clause for which file needs to be found
   * @returns {Promise}
   */
  findOne: async function (clause, opts) {
    const File = getModel("File");
    return File.findOne(clause, opts);
  },

  /**
   * Update a file record
   *
   * @param  {Object} record - record to be updated
   * @param  {Object} record.where - clause for which update needs to happen
   * @param  {Object} record.data - data to be updated
   * @param  {Object} transaction - sequelize transaction
   *
   * @returns {Promise}
   */
  update: async function (record, transaction) {
    const File = getModel("File");

    if (!record || _.isEmpty(record.where) || _.isEmpty(record.data)) {
      return Promise.reject(
        new Error(
          "FileRepository~update: Mandatory Parameters missing"
        )
      );
    }

    return File.update(record.data, {
      where: record.where,
      transaction: transaction,
    });
  },
};
