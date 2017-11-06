/*
 * Callbacks
 * A helper function to handle callbacks from the API methods.
 *
 */

/**
 * ErrorHandler
 * @param {Function} callback
 * @param {Array} args - args[0] should always be an error _or_ null
 */
module.exports = function callbacks(callback, args) {
  const _ = require('lodash');

  // Lets turn args[0] into an error if not `null`
  if (!_.isNull(args[0])) {
    args[0] = new Error(args[0]);
  }

  // The API method who called us also attached a
  // callback-function - Lets run it and apply the args.
  if (_.isFunction(callback)) {
    return callback.apply(this, args);
  }

  // The API method who called us did not attach a
  // callback-function. Lets throw an error if any.
  if (_.isError(args[0])) throw args[0];
};
