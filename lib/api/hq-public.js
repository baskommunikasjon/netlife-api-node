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
        contactId: 'The method `updateContact()` requires that `contactId` is not empty, null or 0.\n\n',
      },
    }
  }

  /**
   * Auth
   * Saves the API key, account and domain for use in other methods.
   * @param {Object} credentials
   */
  auth(credentials) {
    if (_.isObjectLike(credentials)) {
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

      return callbacks(callback, [null, JSON.parse(body)]);
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
      if (_.isFunction(callback)) return callback(new Error(this.messages.unauthorized), null);
      throw new Error(this.messages.unauthorized);
    }

    // We'll accept the number or string as type of `contactId`
    if (!_.isString(contactId) && !_.isNumber(contactId)) {
      if (_.isFunction(callback)) return callback(new Error(this.messages.getContactByContactId.contactId), null);
      throw new Error(this.messages.getContactByContactId.contactId);
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
        if (_.isFunction(callback)) return callback(new Error(err), null);
        throw new Error(err);
      }

      if (response.statusCode === 401) {
        if (_.isFunction(callback)) return callback(new Error(this.messages.wrongCredentials), null);
        throw new Error(this.messages.wrongCredentials);
      }

      const contact = JSON.parse(body);

      // Check if the API is giving us an empty copy of an customer object
      // (this happens when the API can't find a customer by id).
      if (contact.ContactId === 0) {
        if (_.isFunction(callback)) return callback(null, {})
      }

      if (_.isFunction(callback)) return callback(null, contact);
    });

  }

  /**
   * UpdateContact
   * Updates contact if contactId is passed to the method - creates new contact otherwise
   * @param {Object} contactObject
   * @param {Function} callback
   * @callback(error)
   */
  updateContact(contactObject, callback) {
    if (!this.authorized()) {
      return callbacks(callback, [this.messages.unauthorized]);
    }

    // We'll only accept object for `contactObject`
    if (!_.isObjectLike(contactObject)) {
      return callbacks(callback, [this.messages.updateContact.contactObject]);
    }

    if (_.isUndefined(contactObject.contactId) || _.isNull(contactObject.contactId) || contactObject.contactId === 0) {
      return callbacks(callback, [this.messages.updateContact.contactId]);
    }

    this.getContactByContactId(contactObject.contactId, (err, contact) => {
      if (err) {
        return callbacks(callback, [err]);
      }

      //TODO: Here goes the update PUT request.

      return callbacks(callback, [null]);
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
}

module.exports = new HqPublic;
