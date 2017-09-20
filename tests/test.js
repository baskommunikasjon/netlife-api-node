// Init environment variables
require('dotenv').config();

const netlife = require('../index');

netlife.sms.auth({
  xBdnKey: process.env.BDN_KEY,
  xBdnAccount: process.env.BDN_ACCOUNT,
});

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


netlife.sms.sendBulk({
  recipients: [],
  from: 'Netlife',
  message: 'Heihei :)',
}, (err, shipmentId) => {
  if (err) {
    return console.error(err);
  }

  //All done
  console.log(`Bulk SMS was sent successfully with shipmentId ${shipmentId}!`);

    netlife.sms.getShipment(shipmentId, (data) => {
       console.log(data);
    });
});



