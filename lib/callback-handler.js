const _ = require('lodash');

/**
 * ErrorHandler
 * @param {Function} callback
 * @param {Array} args - args[0] should always be an error _or_ null
 */
module.exports = function callbackHandler(callback, args) {
  // Turn args[0] into an error
  if (!_.isNull(args[0])) {
    args[0] = new Error(args[0]);
  }

  if (_.isFunction(callback)) {
    return callback.apply(this, args);
  }

  if (_.isError(args[0])) throw args[0];
};
