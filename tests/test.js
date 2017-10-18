// Init environment variables
require('dotenv').config();
const _ = require('lodash');

const netlife = require('../lib/index');

// netlife.sms.auth({
//   apiKey: process.env.SMS_BDN_KEY,
//   apiAccount: process.env.SMS_BDN_ACCOUNT
// });
//
// netlife.sms.sendSingle({
//   recipient: '+4795033467',
//   from: 'Netlife',
//   message: 'Dette er jo bare en test.',
// }, (err) => {
//   if (err) {
//     return console.error(err);
//   }
//
//   //All done
//   console.log('SMS was sent successfully!')
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

netlife.hqpublic.auth({
  apiKey: process.env.HQPUBLIC_BDN_KEY,
  apiAccount: process.env.HQPUBLIC_BDN_ACCOUT,
  apiDomain: process.env.HQPUBLIC_BDN_DOMAIN,
});

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


netlife.hqpublic.updateContact({
  contactId: 214,
}, (err) => {
  if (err) {
    return console.error(err);
  }
});


//Todo: Create Request handler
