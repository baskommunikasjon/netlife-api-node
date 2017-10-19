/*
 * Unit tests using Mocha
 * Run `mocha tests/start.js --case all`
 *
 * > If you want to test a single case use one of the
 * >  names in the caseList instead of `all`.
 */

// Init environment variables
require('dotenv').config();

// The option --case requires an argument and is also
// a mandatory option for test.

const caseList = require('./case-list');

describe('API', function () {
  const _ = require('lodash');
  _.forEach(caseList, (thisCase) => {
    require(thisCase);
  });
});
