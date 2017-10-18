/*
 * Index.js
 * Main entry point of the package
 *
 */

/**
 * API List
 */
module.exports = {
  sms: require('./api/sms-web'),
  hqpublic: require('./api/hq-public'), // Not implemented
  recordLinking: require('./api/record-linking'), // Not implemented
};
