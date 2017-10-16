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

class hqPublic {

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
    }
  }

  /**
   * Auth
   * Saves the API key, account and domain for use in other methods.
   * @param credentials
   */
  auth(credentials) {
    if (_.isObjectLike(credentials)) {
      if (!credentials.apiKey && !credentials.apiAccount && !credentials.apiDomain) {
        return console.error('Auth: [apiKey], [apiAccount] and [apiDomain] is missing.\n');
      }

      if (!credentials.apiKey) {
        return console.error('Auth: Auth: [apiKey] is missing.\n');
      }

      if (!credentials.apiAccount) {
        return console.error('[Auth: apiAccount] is missing.\n');
      }

      if (!credentials.apiDomain) {
        return console.error('Auth: [apiDomain] is missing.\n');
      }

      this.apiKey = credentials.apiKey;
      this.apiAccount = credentials.apiAccount;
      this.apiDomain = credentials.apiDomain;
      return;
    }

    return console.error('Auth: You need to provide a object with auth credentials.\n');
  };

  /**
   * GetContactsByEmail
   * Get contacts by e-mail address.
   * @param {string} email
   * @param {function} callback
   */
  getContactsByEmail(email, callback) {
    if (!this.authorized()) {
      return console.error(this.messages.unauthorized);
    }

    if (!_.isString(email)) {
      return console.error(this.messages.getContactsByEmail.email);
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
      if (_.isFunction(callback)) {
        if (err) {
          return callback(err, null);
        }

        if (response.statusCode === 401) {
          return callback(this.messages.wrongCredentials, null);
        }

        return callback(null, JSON.parse(body));
      }
    });

  }

  /**
   * GetContactsByEmail
   * Get contacts by mobile number.
   * @param {string || number} mobile
   * @param {function} callback
   */
  getContactsByMobile(mobile, callback) {
    if (!this.authorized()) {
      return console.error(this.messages.unauthorized);
    }

    // Well accept the number or string as type of `mobile`
    if (!_.isString(mobile) && !_.isNumber(mobile)) {
      return console.error(this.messages.getContactsByMobile.mobile);
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
      if (_.isFunction(callback)) {
        if (err) {
          return callback(err, null);
        }

        if (response.statusCode === 401) {
          return callback(this.messages.wrongCredentials, null);
        }

        return callback(null, JSON.parse(body));
      }
    });

  }

  /**
   * GetContactByContactId
   * Get contacts by contactId.
   * @param {string || number} contactId
   * @param {function} callback
   */
  getContactByContactId(contactId, callback) {
    if (!this.authorized()) {
      return console.error(this.messages.unauthorized);
    }

    // Well accept the number or string as type of `contactId`
    if (!_.isString(contactId) && !_.isNumber(contactId)) {
      return console.error(this.messages.getContactByContactId.contactId);
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
      if (_.isFunction(callback)) {
        if (err) {
          return callback(err, null);
        }

        if (response.statusCode === 401) {
          return callback(this.messages.wrongCredentials, null);
        }

        return callback(null, JSON.parse(body));
      }
    });

  }

  /**
   * Authorized
   * Returns if API key and account has been set.
   * @private
   * @return {boolean}
   */
  authorized() {
    return !!(this.apiKey && this.apiAccount && this.apiDomain);
  };
}

module.exports = new hqPublic;
