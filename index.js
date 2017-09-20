/*
 * Index.js
 * Main entry point of the package
 *
 */


/**
 * API List
 */
module.exports = {
  sms: require('./api/sms-web-api'),
  recordLinking: require('./api/record-linking-api'),
};
