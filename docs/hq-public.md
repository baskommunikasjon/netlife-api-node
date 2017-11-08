# HQ-Public API
Used to access and modify customer data in HQ

Background documentation can be [obtained here](https://api.bringcrm.no/hqpublic/v1).

## Methods
- [Authorization](#authorization)
- Contacts
  - [Get by email](#contatcs---get-by-email)
  - [Get by mobile](#contatcs---get-by-mobile)
  - [Get by contactId](#contatcs---get-by-contactid)
  - [Update](#contatcs---update)


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
| `email `   | String   | Contacts e-mail address.                              |
| `callback` | Function | A callback function. Returns `error` and `contacts `. |

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
| `mobile `  | String   | Contacts mobile number.                               |
| `callback` | Function | A callback function. Returns `error` and `contacts `. |

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
| `contactId ` | String   | Contacts ID.                                         |
| `callback`   | Function | A callback function. Returns `error` and `contact `. |

[Back to top](#methods)

---

## Contatcs - Update
Method accepts `contactId`, `contactFields` and `callback`.

```js
netlife.hqpublic.updateContact(214, {
    Firstname: 'Henrik',
    Gender: 'M',
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
| `contactId `    | String   | Contacts ID.                                                                                 |
| `contactFields` | Object   | Object containing of the contact fields you want to edit. See contact fields in table below. |
| `callback`      | Function | A callback function. Returns `error` and `contact `.                                         |

<br/>

*Contact fields:*

| Field              | Type      | Details                                 |
|--------------------|-----------|-----------------------------------------|
| `ContactStatusId ` | Number    |                                         |
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
