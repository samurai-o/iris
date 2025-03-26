const _ = require('lodash');

module.exports = function (model) {
  if (_.get(global, ['app', 'sequelize', 'models', model])) {
    return _.get(global, ['app', 'sequelize', 'models', model]);
  }

  throw new Error(`getModel~ ${model}:: Model not found.`);
};
