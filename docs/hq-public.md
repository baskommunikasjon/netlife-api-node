# HQ-Public API

Used to access and modify customer data in HQ

Background documentation can be [obtained here](https://api.bas.no/hqpublic/v1).

## Methods

- [HQ-Public API](#hq-public-api)
  - [Methods](#methods)
  - [Authorization](#authorization)
  - [Contatcs - Get by email](#contatcs---get-by-email)
  - [Contatcs - Get by mobile](#contatcs---get-by-mobile)
  - [Contatcs - Get by contactId](#contatcs---get-by-contactid)
  - [Contatcs - Update](#contatcs---update)
  - [Contatcs - Create](#contatcs---create)
  - [Marketing Automation - Post Event](#marketing-automation---post-event)

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

[Back to top](#methods)

---

## Contatcs - Get by email

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

| Property   | Type     | Details                                               |
|------------|----------|-------------------------------------------------------|
| `email`   | String   | Contacts e-mail address.                              |
| `callback` | Function | A callback function. Returns `error` and `contacts`. |

[Back to top](#methods)

---

## Contatcs - Get by mobile

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

| Property   | Type     | Details                                               |
|------------|----------|-------------------------------------------------------|
| `mobile`  | String   | Contacts mobile number.                               |
| `callback` | Function | A callback function. Returns `error` and `contacts`. |

[Back to top](#methods)

---

## Contatcs - Get by contactId

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

| Property     | Type     | Details                                              |
|--------------|----------|------------------------------------------------------|
| `contactId` | String   | Contacts ID.                                         |
| `callback`   | Function | A callback function. Returns `error` and `contact`. |

[Back to top](#methods)

---

## Contatcs - Update

Method accepts `contactId`, `contactFields` and `callback`.

```js
netlife.hqpublic.updateContact(214, {
    Firstname: 'Henrik',
    Gender: 'M',
    Addresses: [{
      AddressTypeId: 4,
      Address: 'Drammensveien 145 A',
      City: 'Oslo',
      ExtraFields: [{
        Key: 'Land',    // The main-key of the extra field
        Id: 0,          // The value ID of the extra field
        Value: "Norge", // The value of the extra field
      }],
    }],
    ExtraFields: [{
      Key: 'SomeKey',  // The main-key of the extra field
      Id: 1,           // The value ID of the extra field
      Value: "FooBar", // The value of the extra field
    }]
  }, (err, updatedId) => {
    if (err) {
      return console.error(err);
    }

    console.log(updatedId);
    // => '214' - The ID of the updated contact
  }
);
```

| Property        | Type     | Details                                                                                      |
|-----------------|----------|----------------------------------------------------------------------------------------------|
| `contactId`    | String   | Contacts ID.                                                                                 |
| `contactFields` | Object   | Object containing of the contact fields you want to edit. See contact fields in table below. |
| `callback`      | Function | A callback function. Returns `error` and `updatedId`.                                         |

<br/>

*Contact fields:*

| Field              | Type      | Details                                 |
|--------------------|-----------|-----------------------------------------|
| `ContactStatusId` | Number    |                                         |
| `ContactTypeId`    | Number    | Explanation will be added soon.         |
| `CompanyId`        | Number    |                                         |
| `ContactRoleId`    | Number    | Explanation will be added soon.         |
| `ExternalId`       | Number    |                                         |
| `KrId`             | Number    |                                         |
| `Firstname`        | String    |                                         |
| `Lastname`         | String    |                                         |
| `Gender`           | String    | `M` = Male, `F` = Female, `U` = Unknown |
| `Email`            | String    |                                         |
| `Ssn`              |           |                                         |
| `PhoneMobile`      | String    |                                         |
| `PhoneHome`        | String    |                                         |
| `Dob`              | ISOString | Date of Birth                           |
| `Dead`             | ISOString |                                         |
| `ContactSegments`  | Array     | Explanation will be added soon.         |
| `Addresses`        | Array     | Explanation will be added soon.         |
| `Interests`        | Array     | Explanation will be added soon.         |
| `Permissions`      | Array     | Explanation will be added soon.         |
| `Username`         | String    |                                         |
| `BbMemberId`       | Number    |                                         |
| `BbBonusLevel`     | Number    |                                         |
| `BbBonusTotal`     | Number    |                                         |
| `BbBonusRedeemed`  |           |                                         |
| `BbBonusAvailable` |           |                                         |
| `CreatedDate`      | ISOString |                                         |
| `ChangedDate`      | ISOString |                                         |
| `CreatedByUser`    | String    |                                         |
| `ChangedByUser`    | String    |                                         |
| `Source`           | String    |                                         |
| `ExtraFields`      | Array     | See example above.                      |

[Back to top](#methods)

---

## Contatcs - Create

Method accepts `contactFields` and `callback`.

```js
netlife.hqpublic.createContact({
  ContactStatusId: 1,
  ContactTypeId: 2,
  FirstName: 'Henrik',
  LastName: 'Gundersen',
  ExtraFields: [
    {
      Key: 'Ankomst',
      Id: 2,
    },
    {
      Key: 'Firma',
      Value: 'Netlife Dialog'
    }
  ],
  ReqExtraFields: [  // Used for ExtraFields that is required on creation
    {
      Key: "DK år",
      DomainSchemaFieldType: 2,
      Options: [],
      Values: [
        {
          Id: 4,
          Fields: [
            {
              Key: "Description",
              Value: "DK 2018",
              Type: "System.String"
            }
          ]
        }
      ]
    },
  ]
}, (err, newContactId) => {
  if (err) {
    return console.error(err);
  }

  console.log(newContactId);

});
```

| Property        | Type     | Details                                                                                                                              |
|-----------------|----------|--------------------------------------------------------------------------------------------------------------------------------------|
| `contactFields` | Object   | Object containing of the contact fields you want to edit. See contact fields in table under [Contacts - Update](#contatcs---update). |
| `callback`      | Function | A callback function. Returns `error` and `newContactId`.                                                                             |

<br/>

[Back to top](#methods)

---

## Marketing Automation - Post Event

Method accepts `options` and `callback`.

```js
netlife.hqpublic.postEvent({
  eventTypeName: 'CWACONTACTADDED',
  description: '',
  customerId: '13586',
}, (err) => {
  if (err) {
    return console.error(err);
  }

  console.log('Event posted!');
});
```

| Property        | Type     | Details                               |
|-----------------|----------|---------------------------------------|
| `options`       | Object   | Object containing of the options      |
| `callback`      | Function | A callback function. Returns `error`. |

<br/>

*Options properties:*

| Property        | Type   | Default | Details                                                                                |
|-----------------|--------|---------|----------------------------------------------------------------------------------------|
| `eventTypeName` | String | `null`  | Name of the event type as a string. (Ex. `'CWACONTACTADDED'` or `'CWACONTACTUPDATED'`) |
| `description`   | String | `''`    | Description of event.                                                                  |
| `customerId`    | String | `null`  | CustomerId of the customer the event is about.                                         |
| `context`       | String | `0`     |                                                                                        |

[Back to top](#methods)

---
