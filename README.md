# Netlife-API-node

[![npm version](https://badge.fury.io/js/netlife-api.svg)](https://badge.fury.io/js/netlife-api)

A package for easy access to Netlifs API's.

## Table of contents
- [Install](#install)
- [API's](#apis)
  - [SMS API](#sms-api)
  - [HQ-Public API](#hq-public-api)

## Install
Run `npm install netlife-api --save` in your console to install this package.

---

## API's
### SMS API
Background documentation can be [obtained here](https://secure.bringcrm.no/api/sms/v1).

#### Authorization

You have to authorize before using any other methods in this API.
```js
const netlife = require('netlife-api');

netlife.sms.auth({
    apiKey: '<x-bdn-key>',
    apiAccount: '<x-bdn-account>',
});
```

#### Send single SMS
Method accepts `options`-object and `callback`.
```js
netlife.sms.sendSingle({
  recipient: '+4712345678',
  from: 'Netlife',
  message: 'This is my SMS text.',
}, (err) => {
  if (err) {
    return console.error(err);
  }

  //All done
  console.log('SMS was sent successfully!')
});
```
*Options properties:*

| Property    | Type   | Default | Details                                                                        |
|-------------|--------|---------|--------------------------------------------------------------------------------|
| `recipient` | String | `null`  | Mobile number to the single recipient with country code. (Ex. +4799999999)     |
| `from`      | String | `2262`  | Alphanumeric sender name [0-9] [A-Z]. Sender name does not support whitespace. |
| `message`   | String | `null`  | The text message to send.                                                      |


#### Send bulk SMS
Method accepts `options`-object and `callback`.
```js
bdnAPI.sms.sendBulk({
  recipients: ['+4712345678', '+4787654321'],
  from: 'Netlife',
  message: 'This is my SMS text.',
}, (err, shipmentId) => {
  if (err) {
    return console.error(err);
  }

  //All done
  console.log(`Bulk SMS was sent successfully with shipmentId ${shipmentId}!`);
});
```
*Options properties:*

| Property           | Type      | Default                | Details                                                                                                                            |
|--------------------|-----------|------------------------|------------------------------------------------------------------------------------------------------------------------------------|
| `recipients`       | Array     | `[]`                   | Array with mobile numbers to recipients with country code. (Ex. `['+4799999999', '+4712345678']`).                                 |
| `from`             | String    | `2262`                 | Alphanumeric sender name [0-9] [A-Z]. Sender name does not support whitespace.                                                     |
| `message`          | String    | `null`                 | The text message to send.                                                                                                          |
| `sendTime`         | ISOString | `Date().toISOstring()` | The date and time you want the SMS to be sent. (Ex. `2017-09-01T12:30:00.000Z). Default option will send the bulk SMS right away. |
| `removeDuplicates` | Boolean   | `true`                 | Whether to remove duplicate recipients. If set to `false` a recipient may get the SMS more then once.                              |


#### Get shipment
```js
netlife.sms.getShipment(shipmentId, (data) => {
  console.log(data);
});
```
---

### HQ-Public API
Background documentation can be [obtained here](https://api.bringcrm.no/hqpublic/v1).

#### Authorization
You have to authorize before using any other methods in this API.
```js
const netlife = require('netlife-api');

netlife.hqpublic.auth({
  apiKey: '<x-bdn-key>',
  apiAccount: '<x-bdn-account>',
  apiDomain: '<x-bdn-domain>',
});
```

#### Get contacts by email
Method accepts `email` and `callback`.

```js
netlife.hqpublic.getContactsByEmail('henrik.gundersen@netlife.com', (err, contacts) => {
  if (err) {
    return console.error(err);
  }
  
  console.log(contacts);
  // => Array of objects containing contacts matching the email.
});
```

#### Get contacts by mobile
Method accepts `mobile` and `callback`.

```js
netlife.hqpublic.getContactsByMobile('12345678', (err, contacts) => {
  if (err) {
    return console.error(err);
  }
  console.log(contacts);
  // => Array of objects containing contacts matching the mobile number.
});
```

#### Get contact by contactId
Method accepts `contactId` and `callback`.

```js
netlife.hqpublic.getContactByContactId(11936, (err, contact) => {
  if (err) {
    return console.error(err);
  }

  console.log(contact)
  // => Object containing a single contact matching the contactId.
});
```
