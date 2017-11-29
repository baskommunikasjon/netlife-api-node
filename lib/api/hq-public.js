/**
 * @license
 * MIT License

 * Copyright (c) 2017 Netlife Gruppen AS

 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:

 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.

 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 *
 */

/*
 *  hq-public.js
 *  Background docs: https://api.bringcrm.no/hqpublic/v1
 */

const _ = require('lodash');
const callbacks = require('../helper/callbacks');


class HqPublic {

  /**
   * Constructor
   * @constructor
   */
  constructor() {
    this.apiKey = null;
    this.apiAccount = null;
    this.apiDomain = null;

    this.messages = {
      unauthorized: 'You have to authorize before using this API method.\nUse the `auth()` method.\n\n',
      wrongCredentials: 'Wrong API credentials. Update settings in the `auth()` method.\n\n',
      getContactsByEmail: {
        email: 'The method `getContactsByEmail()` requires an e-mail address. Add this to the parameters.\n\n',
      },
      getContactsByMobile: {
        mobile: 'The method `getContactsByMobile()` requires a mobile number. Add this to the parameters.\n\n',
      },
      getContactByContactId: {
        contactId: 'The method `getContactByContactId()` requires an ContactId. Add this to the parameters.\n\n',
      },
      updateContact: {
        contactObject: 'The method `updateContact()` requires a contactObject. Add this to the parameters.\n\n',
        contactId: 'The method `updateContact()` requires that `contactId` is a number and not 0.\n\n',
        contactNotFound: 'The method `updateContact()` did not find any contact that matched the Id.\n\n',
      },
      createContact: {
        contactObject: 'The method `createContact()` requires a contactObject. Add this to the parameters.\n\n',
      },
      postEvent: {
        options: 'The method `postEvent()` requires a option-object. Add this to the parameters.\n\n',
      }
    }
  }

  /**
   * Auth
   * Saves the API key, account and domain for use in other methods.
   * @param {Object} credentials
   */
  auth(credentials) {
    if (_.isPlainObject(credentials)) {
      if (!credentials.apiKey && !credentials.apiAccount && !credentials.apiDomain) {
        throw new Error('Auth: [apiKey], [apiAccount] and [apiDomain] is missing.');
      }

      if (!credentials.apiKey) {
        throw new Error('Auth: Auth: [apiKey] is missing.');
      }

      if (!credentials.apiAccount) {
        throw new Error('[Auth: apiAccount] is missing.');
      }

      if (!credentials.apiDomain) {
        throw new Error('Auth: [apiDomain] is missing.');
      }

      this.apiKey = credentials.apiKey;
      this.apiAccount = credentials.apiAccount;
      this.apiDomain = credentials.apiDomain;
      return;
    }

    throw new Error('Auth: You need to provide a object with auth credentials.');
  };

  /**
   * GetContactsByEmail
   * Get contacts by e-mail address.
   * @param {String} email
   * @param {Function} callback
   * @callback(error, contacts)
   */
  getContactsByEmail(email, callback) {
    if (!this.authorized()) {
      return callbacks(callback, [this.messages.unauthorized, null]);
    }

    if (!_.isString(email)) {
      return callbacks(callback, [this.messages.getContactsByEmail.email, null]);
    }

    const request = require('request');

    request({
      method: 'GET',
      url: `https://api.bringcrm.no/hqpublic/v1/CustomerAPI/Contacts/GetByEmail?email=${email}`,
      headers: {
        'cache-control': 'no-cache',
        'x-bdn-account': this.apiAccount,
        'x-bdn-key': this.apiKey,
        'x-bdn-domain': this.apiDomain,
      }
    }, (err, response, body) => {
      if (err) {
        return callbacks(callback, [err, null]);
      }

      if (response.statusCode === 401) {
        return callbacks(callback, [this.messages.wrongCredentials, null]);
      }

      return callbacks(callback, [null, JSON.parse(body)]);
    });

  }

  /**
   * GetContactsByEmail
   * Get contacts by mobile number.
   * @param {String || Number} mobile
   * @param {Function} callback
   * @callback(error, contacts)
   */
  getContactsByMobile(mobile, callback) {
    if (!this.authorized()) {
      return callbacks(callback, [this.messages.unauthorized, null]);
    }

    // Well accept the number or string as type of `mobile`
    if (!_.isString(mobile) && !_.isNumber(mobile)) {
      return callbacks(callback, [this.messages.getContactsByMobile.mobile, null]);
    }

    // URL encode `mobile`
    mobile = encodeURIComponent(mobile);

    const request = require('request');

    request({
      method: 'GET',
      url: `https://api.bringcrm.no/hqpublic/v1/CustomerAPI/Contacts/GetByMobile?mobile=${mobile}`,
      headers: {
        'cache-control': 'no-cache',
        'x-bdn-account': this.apiAccount,
        'x-bdn-key': this.apiKey,
        'x-bdn-domain': this.apiDomain,
      }
    }, (err, response, body) => {
      if (err) {
        return callbacks(callback, [err, null]);
      }

      if (response.statusCode === 401) {
        return callbacks(callback, [this.messages.wrongCredentials, null]);
      }

      let returnJson;
      try {
        returnJson = JSON.parse(body);
      } catch (e) {
        returnJson = body;
      }

      if (_.isString(returnJson)) {
        return callbacks(callback, [body, null]);
      }

      return callbacks(callback, [null, returnJson]);
    });

  }

  /**
   * GetContactByContactId
   * Get contacts by contactId.
   * @param {String || Number} contactId
   * @param {Function} callback
   * @callback(error, contact)
   */
  getContactByContactId(contactId, callback) {
    if (!this.authorized()) {
      return callbacks(callback, [this.messages.unauthorized, null]);
    }

    // We'll accept the number or string as type of `contactId`
    if (!_.isString(contactId) && !_.isNumber(contactId)) {
      return callbacks(callback, [this.messages.getContactByContactId.contactId, null]);
    }

    const request = require('request');

    request({
      method: 'GET',
      url: `https://api.bringcrm.no/hqpublic/v1/CustomerAPI/Contacts?contactId=${contactId}`,
      headers: {
        'cache-control': 'no-cache',
        'x-bdn-account': this.apiAccount,
        'x-bdn-key': this.apiKey,
        'x-bdn-domain': this.apiDomain,
      }
    }, (err, response, body) => {
      if (err) {
        return callbacks(callback, [err, null]);
      }

      if (response.statusCode === 401) {
        return callbacks(callback, [this.messages.wrongCredentials, null]);
      }

      const contact = JSON.parse(body);

      // Check if the API is giving us an empty copy of an customer object
      // (this happens when the API can't find a customer by id).
      if (contact.ContactId === 0) {
        return callbacks(callback, [null, {}]);
      }

      return callbacks(callback, [null, contact]);
    });

  }

  /**
   * UpdateContact
   * Updates contact with new data
   * @param {Number} contactId
   * @param {Object} contactObject
   * @param {Function} callback
   * @callback(error, contactId)
   */
  updateContact(contactId, contactObject, callback) {
    if (!this.authorized()) {
      return callbacks(callback, [this.messages.unauthorized, null]);
    }

    // We'll only accept number and not 0 for `contactId`
    if (!_.isNumber(contactId) || contactObject.contactId === 0) {
      return callbacks(callback, [this.messages.updateContact.contactId, null]);
    }

    // We'll only accept object for `contactObject`
    if (!_.isPlainObject(contactObject)) {
      return callbacks(callback, [this.messages.updateContact.contactObject, null]);
    }

    this.getContactByContactId(contactId, (err, contact) => {
      if (err) {
        return callbacks(callback, [err]);
      }

      // Check if a contact was returned.
      if (!_.has(contact, 'ContactId')) {
        return callbacks(callback, [this.messages.updateContact.contactNotFound, null]);
      }

      // Remove value of extrafileds that HQ returnes on the root object as it overrides some extra fields.
      _.forEach(contact.ExtraFields, (value) => {
        delete contact[value.Key];
      });

      _.forEach(contactObject.ExtraFields, (extraField) => {
        _.forEach(contact.ExtraFields, (value, i) => {
          if (value.Key === extraField.Key) {

            if (!_.isUndefined(extraField.Id)) {
              contact.ExtraFields[i].Values[0].Id = extraField.Id;
            }

            if (!_.isUndefined(extraField.Value)) {
              contact.ExtraFields[i].Values[0].Fields[0].Value = extraField.Value;
            }

          }
        })
      });

      // contactObject.ExtraFields has done its purpose.. Lets delete it before it merges into the object
      delete contactObject.ExtraFields;

      const contactObjectAddresses = contactObject.Addresses.slice();
      _.forEach(contactObjectAddresses, (address, x) => {
        _.forEach(contact.Addresses, (value, i) => {

          if (value.AddressTypeId === address.AddressTypeId) {

            _.forEach(address.ExtraFields, (extraField) => {
              _.forEach(value.ExtraFields, (extraFieldValue, index) => {
                if (extraField.Key === extraFieldValue.Key) {
                  if (!_.isUndefined(extraField.Id)) {
                    contact.Addresses[i].ExtraFields[index].Values[0].Id = extraField.Id;
                  }

                  if (!_.isUndefined(extraField.Value)) {
                    contact.Addresses[i].ExtraFields[index].Values[0].Fields[0].Value = extraField.Value;
                  }
                }
              })
            });

            delete contactObject.Addresses[x].ExtraFields;

            _.merge(contact.Addresses[i], address);

            contactObject.Addresses.splice(x, 1);
          }
        });
      });

      // Work with the rest of the contactObject.Addresses - They are new to the contact
      _.forEach(contactObject.Addresses, (address, x) => {
        // console.log(address);
        let tempAddressObject = {};
        tempAddressObject.ExtraFields = [];

        _.forEach(address.ExtraFields, (extraField, i) => {
          tempAddressObject.ExtraFields.push({
            Key: extraField.Key,
            DomainSchemaFieldType: 0,
            Options: [],
            Values: [
              {
                Id: _.isUndefined(extraField.Id) ? null : extraField.Id,
                Fields: [
                  {
                    Value: _.isUndefined(extraField.Value) ? null : extraField.Value,
                  }
                ]
              }
            ]
          })
        });

        delete address.ExtraFields;
        _.merge(tempAddressObject, address);

        console.log(tempAddressObject);
        contact.Addresses.push(tempAddressObject);
      });

      // contactObject.Addresses has done its purpose.. Lets delete it before it merges into the object
      delete contactObject.Addresses;

      contact = this.mergeOptions(contact, contactObject);

      const request = require('request');

      request({
        method: 'PUT',
        url: `https://api.bringcrm.no/hqpublic/v1/CustomerAPI/Contacts`,
        headers: {
          'cache-control': 'no-cache',
          'content-type': 'application/json',
          'x-bdn-account': this.apiAccount,
          'x-bdn-key': this.apiKey,
          'x-bdn-domain': this.apiDomain,
        },
        body: JSON.stringify(contact),
      }, (err, response, body) => {
        if (err) {
          return callbacks(callback, [err, null]);
        }

        if (response.statusCode === 401) {
          return callbacks(callback, [this.messages.wrongCredentials, null]);
        }

        return callbacks(callback, [null, body]);
      });
    });
  };

  /**
   * CreateContact
   * Creates contact
   * @param {Object} contactObject
   * @param {Function} callback
   * @callback(error, newContactId)
   */
  createContact(contactObject, callback) {
    if (!this.authorized()) {
      return callbacks(callback, [this.messages.unauthorized, null]);
    }

    // We'll only accept object for `contactObject`
    if (!_.isPlainObject(contactObject)) {
      return callbacks(callback, [this.messages.createContact.contactObject, null]);
    }

    if (contactObject['ContactId']) {
      delete contactObject["ContactId"];
      console.warn('WARNING: `ContactId` can\'t be used with the `createContact()`method. \nWe removed it for now, but you should remove it from the contactObject parameter.');
    }

    // Temp variable for extraFields we going to update customer with later on.
    const extraFields = contactObject['ExtraFields'];
    delete contactObject['ExtraFields'];

    // Move ReqExtraFields to ExtraFields
    if (contactObject['ReqExtraFields']) {
      contactObject['ExtraFields'] = contactObject['ReqExtraFields'];
      delete contactObject['ReqExtraFields'];
    }

    const request = require('request');

    request({
      method: 'POST',
      url: `https://api.bringcrm.no/hqpublic/v1/CustomerAPI/Contacts`,
      headers: {
        'cache-control': 'no-cache',
        'content-type': 'application/json',
        'x-bdn-account': this.apiAccount,
        'x-bdn-key': this.apiKey,
        'x-bdn-domain': this.apiDomain,
      },
      body: JSON.stringify(contactObject),
    }, (err, response, body) => {
      if (err) {
        return callbacks(callback, [err, null]);
      }

      const customerId = _.toNumber(body);

      if (_.isNaN(customerId)) {
        return callbacks(callback, [body, null]);
      }

      delete contactObject['ExtraFields'];
      contactObject['ExtraFields'] = extraFields;

      this.updateContact(customerId, contactObject, (err, contactId) => {
        if (err) {
          return callbacks(callback, [err, null]);
        }

        return callbacks(callback, [null, contactId]);
      });

    });
  }

  /**
   * PostEvent
   * Post a custom event to the marketing automation engine
   * @param {Object} options
   * @param {Function} callback
   * @callback(error)
   */
  postEvent(options, callback) {
    if (!this.authorized()) {
      return callbacks(callback, [this.messages.unauthorized]);
    }

    // We'll only accept object for `options`
    if (!_.isPlainObject(options)) {
      return callbacks(callback, [this.messages.postEvent.options]);
    }

    console.log(options);

    if (!options.eventTypeName) {
      return callbacks(callback, ['`eventTypeName` is required in `postEvent()` method.']);
    }

    if (!options.description) {
      options.description = '';
    }

    if (!options.customerId) {
      return callbacks(callback, ['`customerId` is required in `postEvent()` method.']);
    }

    if (!options.context) {
      options.context = '0';
    }

    const request = require('request');

    request({
      method: 'POST',
      url: 'https://api.bringcrm.no/hqpublic/v1/CustomerAPI/MarketingAutomation/PostEvent',
      qs: {
        eventTypeName: options.eventTypeName,
        description: options.description,
        customerId: options.customerId,
        context: options.context,
      },
      headers: {
        'cache-control': 'no-cache',
        'content-type': 'application/json',
        'x-bdn-account': this.apiAccount,
        'x-bdn-key': this.apiKey,
        'x-bdn-domain': this.apiDomain,
      }
    }, (err, response, body) => {
      if (err) {
        return callbacks(callback, [err])
      }

      if (response.statusCode === 401) {
        return callbacks(callback, [this.messages.wrongCredentials]);
      }

      return callbacks(callback, [null])
    });

  }

  /**
   * Authorized
   * Returns if API key and account has been set.
   * @private
   * @return {Boolean}
   */
  authorized() {
    return !!(this.apiKey && this.apiAccount && this.apiDomain);
  };

  /**
   * MergeOptions
   * Merges the default options with options sent with the method.
   * @private
   * @param {Object} defaultOptions
   * @param {Object} options
   * @return {Object}
   */
  mergeOptions(defaultOptions = {}, options = {}) {
    return Object.assign(defaultOptions, options);
  };
}

module.exports = new HqPublic;
