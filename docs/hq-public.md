# HQ-Public API
Used to access and modify customer data in HQ

Background documentation can be [obtained here](https://api.bringcrm.no/hqpublic/v1).

## Methods
- [Authorization](#authorization)
- Contacts
  - [Get contacts by email](#get-contacts-by-email)
  - [Get contacts by mobile](#get-contacts-by-mobile)
  - [Get contact by contactId](#get-contact-by-contactid)


---

## Authorization
You have to authorize before using any other methods in this API.
```js
const netlife = require('netlife-api');

netlife.hqpublic.auth({
  apiKey: '<x-bdn-key>',
  apiAccount: '<x-bdn-account>',
  apiDomain: '<x-bdn-domain>',
});
```

## Get contacts by email
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

## Get contacts by mobile
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

## Get contact by contactId
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

