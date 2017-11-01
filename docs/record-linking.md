# Record Linking API
Used to obtain data/records about one or many people matching a search criteria.

Background documentation can be [obtained here](https://api.bringcrm.no/recordlinking/v2/).

## Methods
- [Authorization](#authorization)
- Records
  - [Get Single](#records---get-single)
  - [Get Multi](#records---get-multi)

---

## Authorization

You have to authorize before using any other methods in this API.
```js
const netlife = require('netlife-api');

netlife.recordLinking.auth({
    apiKey: '<x-bdn-key>',
    apiAccount: '<x-bdn-account>',
});
```
[Back to top](#methods)

---

## Records - Get Single
Method accepts `options`-object and `callback`.
```js
netlife.recordLinking.getSingle({
  washDegree: 2,
  search: {
    // fulltext: 'Henrik Brath Gundersen',
    firstName: 'Henrik',
    middleName: 'Brath',
    lastName: 'Gundersen',
  },
  contactFields: [
    'firstName',
    'age',
  ],
  analyzeFields: [],
}, (err, record) => {
  if (err) {
    return console.error(err);
  }

  console.log(record);
  // => Object with matching record.
});
```
| Property   | Type     | Details                                             |
|------------|----------|-----------------------------------------------------|
| `options`  | Objetct  | Object with options. See options in table below.    |
| `callback` | Function | A callback function. Returns `error` and `record`. |

<br/>

*`options` properties:*

| Property         | Type   | Default                                                                                                                                                            | Details                                                                                                                                                  |
|------------------|--------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------|
| `washDegree`     | Number | `0`                                                                                                                                                                | A number between 0-8. The lower the value the stricter match. For automatic processes, keep this value lower than 5. Above 5 should be handled manually. |
| `search`         | Object | `{}`                                                                                                                                                               | A object containing of all search criteria fields. See fields in table below.                                                                            |
| `contactFields ` | Array  | `['krId', 'phone', 'mobile', 'firstName', 'middleName', 'lastName', 'streetName', 'streetNumber', 'streetLetter', 'streetZipCode', 'streetCity', 'age', 'gender']` | Contact fields to return in result. See fields in table below.                                                                                           |
| `analyzeFields`  | Array  | `[]`                                                                                                                                                               | Analyze fields to return in result. See fields in table below.                                                                                           |

<br/>

*`search` properties:*

| Property        | Type   | Default | Details                                                                                                       |
|-----------------|--------|---------|---------------------------------------------------------------------------------------------------------------|
| `fulltext`      | String | `null`  | Fuzzy search string. Can contain whatever search parameter. If present all other criteria fields are ignored. |
| `firstName`     | String | `null`  |                                                                                                               |
| `middleName`    | String | `null`  |                                                                                                               |
| `lastName`      | String | `null`  |                                                                                                               |
| `addressName`   | String | `null`  |                                                                                                               |
| `addressNumber` | String | `null`  |                                                                                                               |
| `addressLetter` | String | `null`  |                                                                                                               |
| `zipCode`       | String | `null`  |                                                                                                               |
| `city`          | String | `null`  |                                                                                                               |
| `mobile`        | String | `null`  |                                                                                                               |
| `phone`         | String | `null`  |                                                                                                               |

<br/>

*`contactFields` properties:*

| Property           | Details                                                           |
|--------------------|-------------------------------------------------------------------|
| `krId`             | Netlifes unique ID for this person.                               |
| `phone `           |                                                                   |
| `mobile `          |                                                                   |
| `firstName `       |                                                                   |
| `middleName`       |                                                                   |
| `lastName`         |                                                                   |
| `streetName`       |                                                                   |
| `streetNumber`     |                                                                   |
| `streetLetter`     |                                                                   |
| `streetZipCode`    |                                                                   |
| `streetCity`       |                                                                   |
| `boxName`          |                                                                   |
| `boxNumber`        |                                                                   |
| `boxOffice`        |                                                                   |
| `boxCity`          |                                                                   |
| `matchScore`       | Match score. A1 is best. Contact Netlife for further information. |
| `age`              |                                                                   |
| `gender`           | `1` = Man, `2` = Woman, `3`/`4` = Unknown                         |
| `reservationBRREG` |                                                                   |
| `deceasedDate`     |                                                                   |

[Back to top](#methods)

---

## Records - Get Multi
Method accepts `options`-object and `callback`.
```js
netlife.recordLinking.getMulti({
  maxResults: 5,
  search: {
    // fulltext: 'Henrik Gundersen Jerpefaret',
    firstName: 'Henrik',
    lastName: 'Gundersen',
    addressName: 'Jerpefaret',
  }
}, (err, records) => {
  if (err) {
    return console.error(err);
  }

  console.log(records);
  // => Array of all matching records.
});
```

| Property   | Type     | Details                                             |
|------------|----------|-----------------------------------------------------|
| `options`  | Objetct  | Object with options. See options in table below.    |
| `callback` | Function | A callback function. Returns `error` and `records`. |

<br/>

*`options` properties:*

| Property               | Type   | Default | Details                                                                                                       |
|------------------------|--------|---------|---------------------------------------------------------------------------------------------------------------|
| `maxResults`           | Number | `20`    | Number representing how many maximum records you want in return.                                              |
| `search`               | Object | `{}`    | A object containing of all search criteria fields. See fields in table below.                                                           |

<br/>

*`search` properties:*

| Property               | Type   | Default | Details                                                                                                       |
|------------------------|--------|---------|---------------------------------------------------------------------------------------------------------------|
| `fulltext`      | String | `null`  | Fuzzy search string. Can contain whatever search parameter. If present all other criteria fields are ignored. |
| `firstName`     | String | `null`  |                                                                                                               |
| `middleName`    | String | `null`  |                                                                                                               |
| `lastName`      | String | `null`  |                                                                                                               |
| `addressName`   | String | `null`  |                                                                                                               |
| `addressNumber` | String | `null`  |                                                                                                               |
| `addressLetter` | String | `null`  |                                                                                                               |
| `zipCode`       | String | `null`  |                                                                                                               |
| `city`          | String | `null`  |                                                                                                               |
| `mobile`        | String | `null`  |                                                                                                               |
| `phone`         | String | `null`  |                                                                                                               |
| `companyName`   | String | `null`  |                                                                                                               |
| `companyOrgNo`  | String | `null`  |                                                                                                               |

[Back to top](#methods)

---
