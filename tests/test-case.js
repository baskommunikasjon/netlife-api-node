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
const args = require('cli.args')(['case:!']);

const caseList = require('./case-list');

describe('API', function () {
  switch (args['case']) {
    case 'sms':
      require(caseList.sms);
      break;
    case 'all':
      const _ = require('lodash');
      _.forEach(caseList, (thisCase) => {
        require(thisCase);
      });
      break;
  }
});

//const netlife = require('../lib/index');


// describe('API', function () {
//   require('./cases/sms');
// });


// netlife.sms.sendBulk({
//   recipients: [],
//   from: 'Netlife',
//   message: 'Heihei :)',
// }, (err, shipmentId) => {
//   if (err) {
//     return console.error(err);
//   }
//
//   //All done
//   console.log(`Bulk SMS was sent successfully with shipmentId ${shipmentId}!`);
//
//     netlife.sms.getShipment(shipmentId, (data) => {
//        console.log(data);
//     });
// });

// netlife.hqpublic.auth({
//   apiKey: process.env.HQPUBLIC_BDN_KEY,
//   apiAccount: process.env.HQPUBLIC_BDN_ACCOUT,
//   apiDomain: process.env.HQPUBLIC_BDN_DOMAIN,
// });

// netlife.hqpublic.getContactsByEmail('henrik.gundersen@bringdialog.no', (err, contacts) => {
//   if (err) {
//     return console.error(err);
//   }
//   console.log(contacts);
//
// });

// netlife.hqpublic.getContactsByMobile('12345678', (err, contacts) => {
//   if (err) {
//     return console.error(err);
//   }
//   console.log(contacts);
// });

// netlife.hqpublic.getContactByContactId(214, (err, contact) => {
//   if (err) {
//     return console.error(err);
//   }
//
//   console.log(contact)
// });


// netlife.hqpublic.updateContact({
//   contactId: 214,
// }, (err) => {
//   if (err) {
//     return console.error(err);
//   }
// });


//Todo: Create Request handler
