const _ = require('lodash');

module.exports = function errorHandler(callbackFunction, args) {

  callbackFunction.apply(this, args)
};
