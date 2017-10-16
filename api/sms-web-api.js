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
 *  sms-web-api.js
 *  Background docs: https://secure.bringcrm.no/api/sms/v1
 */

class SmsWebApi {

  /**
   * Constructor
   * @public
   */
  constructor() {
    this.apiKey = null;
    this.apiAccount = null;

    this.messages = {
      unauthorized: 'You have to authorize before using this API method.\nUse the `auth()` method.\n\n',
      wrongCredentials: 'Wrong API credentials. Update settings in the `auth()` method.\n\n',
      sendSingle: {
        recipient: 'The method `sendSingle()` requires a recipient.\nAdd this to the options.\n\n',
        message: 'The method `sendSingle()` requires a message.\nAdd this to the options.\n\n',
        smsFailed: 'Something went wrong - The SMS was not sent.\n\n',
      },
      sendBulk: {
        recipients: 'The method `sendBulk()` requires at least one recipient.\nAdd this to the options.\n\n',
        message: 'The method `sendBulk()` requires a message.\nAdd this to the options.\n\n',
        smsFailed: 'Something went wrong - The bulk-SMS was not sent.\n\n',
      },
      getShipment: {
        shipmentId: 'The method `getShipment()` requires a `shipmentId`.\nAdd this to the options.\n\n',
      },
    }
  }

  /**
   * Auth
   * Saves the API key and account for use in other methods.
   * @param credentials
   */
  auth(credentials = {}) {
    if (!credentials.apiKey && !credentials.apiAccount) {
      return console.error('Auth: [apiKey] and [apiAccount] is missing.\n');
    }

    if (!credentials.apiKey) {
      return console.error('Auth: [apiKey] is missing.\n');
    }

    if (!credentials.apiAccount) {
      return console.error('Auth: [apiAccount] is missing.\n');
    }

    this.apiKey = credentials.apiKey;
    this.apiAccount = credentials.apiAccount;
  };

  /**
   * SendSingle
   * Send SMS to a single recipient.
   * @param options
   * @param callback
   */
  sendSingle(options = {}, callback) {
    if (!this.authorized()) {
      return console.error(this.messages.unauthorized);
    }

    const defaultOptions = {
      recipient: null,
      from: 2262,
      message: null,
    };

    // Merge Options with defaultOptions
    options = this.mergeOptions(defaultOptions, options);

    // Check if options has a recipient.
    if (!options.recipient) {
      return console.error(this.messages.sendSingle.recipient);
    }

    // Check if options has a message.
    if (!options.message) {
      return console.error(this.messages.sendSingle.message);
    }

    const request = require('request');

    request({
      method: 'POST',
      url: 'https://secure.bringcrm.no/api/sms/v1/Rpc/Single/Send',
      headers: {
        'cache-control': 'no-cache',
        'content-type': 'application/json',
        'x-bdn-account': this.apiAccount,
        'x-bdn-key': this.apiKey,
      },
      body: {
        PhoneNumber: options.recipient,
        Message: options.message,
        From: options.from,
      },
      json: true
    }, (err, response, body) => {
      if (_.isFunction(callback)) {
        if (err) {
          return callback(err);
        }

        if (response.statusCode === 401) {
          return callback(this.messages.wrongCredentials);
        }

        if (response.statusCode !== 200) {
          return callback(this.messages.sendSingle.smsFailed);
        }

        return callback(null);
      }
    });
  };

  /**
   * SendBulk
   * Send bulk SMS to many recipients.
   * @param options
   * @param callback
   */
  sendBulk(options = {}, callback) {
    if (!this.authorized()) {
      return console.error(this.messages.unauthorized);
    }

    const defaultOptions = {
      recipients: [],
      from: 2262,
      message: null,
      sendTime: new Date().toISOString(),
      removeDuplicates: true,
    };

    // Merge Options with defaultOptions.
    options = this.mergeOptions(defaultOptions, options);

    // Remove duplicate recipients if option is true.
    if (options.removeDuplicates) {
      options.recipients = Array.from(new Set(options.recipients));
    }

    options.recipients = 'MOBILE\n' + options.recipients.join('\n');

    // Check if options has recipients.
    if (!options.recipients.length) {
      return console.error(this.messages.sendBulk.recipients);
    }

    // Check if options has a message.
    if (!options.message) {
      return console.error(this.messages.sendBulk.message);
    }

    const request = require("request");

    request({
      method: 'POST',
      url: 'https://secure.bringcrm.no/api/sms/v1/Rpc/Bulk/Send',
      headers: {
        'cache-control': 'no-cache',
        'content-type': 'application/json',
        'x-bdn-account': this.apiAccount,
        'x-bdn-key': this.apiKey,
      },
      body: {
        Template: {
          MessageTemplate: options.message,
          From: options.from,
        },
        Recipients: options.recipients,
        RecipientsPhoneColumnName: 'MOBILE',
        SendTime: options.sendTime,
      },
      json: true
    }, (err, response, body) => {
      if (_.isFunction(callback)) {
        if (err) {
          return callback(err, null);
        }

        if (response.statusCode === 401) {
          return callback(this.messages.wrongCredentials, null);
        }

        if (response.statusCode !== 200) {
          return callback(this.messages.sendBulk.smsFailed, null);
        }

        return callback(null, body.ShipmentId);
      }
    });

  };

  /**
   * GetShipment
   * Returns information about a shipment
   * @param shipmentId
   * @param callback
   */
  getShipment(shipmentId, callback) {
    if (!this.authorized()) {
      return console.error(this.messages.unauthorized);
    }

    // Check if call has an shipment ID.
    if (!shipmentId) {
      return console.error(this.messages.getShipment.shipmentId);
    }

    const request = require('request');

    request({
      method: 'GET',
      url: 'https://secure.bringcrm.no/api/sms/v1/Rpc/Report/GetShipment',
      qs: {shipmentId: shipmentId},
      headers: {
        'cache-control': 'no-cache',
        'x-bdn-account': this.apiAccount,
        'x-bdn-key': this.apiKey,
      }
    }, (error, response, body) => {
      if (_.isFunction(callback)) {
        if (err) {
          return callback(err, null);
        }

        if (response.statusCode === 401) {
          return callback(this.messages.wrongCredentials, null);
        }


        return callback(null, body);
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
    return !!(this.apiKey && this.apiAccount);
  };

  /**
   * MergeOptions
   * Merges the default options with options sent with the method.
   * @private
   * @param defaultOptions
   * @param options
   * @return {Object}
   */
  mergeOptions(defaultOptions = {}, options = {}) {
    return Object.assign(defaultOptions, options);
  };
}

module.exports = new SmsWebApi;
