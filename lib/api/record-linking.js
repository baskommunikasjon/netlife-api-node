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
 *  record-linking.js
 *  Background docs: https://api.bas.no/recordlinking/v2/
 */

const _ = require('lodash');
const callbacks = require('../helper/callbacks');

class RecordLinking {

  /**
   * Constructor
   * @constructor
   */
  constructor() {
    this.apiKey = null;
    this.apiAccount = null;

    this.messages = {
      unauthorized: 'You have to authorize before using this API method.\nUse the `auth()` method.\n\n',
      wrongCredentials: 'Wrong API credentials. Update settings in the `auth()` method.\n\n',
      getSingle: {
        toMany: 'The method `getSingle()` requires a more specific search - Multiple records where found\n\n',
      },
      getMulti: {
        noSearch: 'The method `getMulti()` requires at least one search criteria.\nAdd this to the options.\n\n',
      },
    }
  }

  /**
   * Auth
   * Saves the API key and account for use in other methods.
   * @param {Object} credentials
   */
  auth(credentials) {
    if (_.isPlainObject(credentials)) {
      if (!credentials.apiKey && !credentials.apiAccount) {
        throw new Error('Auth: [apiKey] and [apiAccount] is missing.');
      }

      if (!credentials.apiKey) {
        throw new Error('Auth: [apiKey] is missing.');
      }

      if (!credentials.apiAccount) {
        throw new Error('Auth: [apiAccount] is missing.');
      }

      this.apiKey = credentials.apiKey;
      this.apiAccount = credentials.apiAccount;
      return;
    }

    throw new Error('Auth: You need to provide a object with auth credentials.');
  };

  /**
   * GetSingle
   * Get one record matching search
   * @param {object} options
   * @param {function} callback
   * @callback(error, record)
   */
  getSingle(options, callback) {
    if (!this.authorized()) {
      return callbacks(callback, [this.messages.unauthorized, null]);
    }

    const defaultOptions = {
      washDegree: 0,
      contactFields: [
        'krId',
        'phone',
        'mobile',
        'firstName',
        'middleName',
        'lastName',
        'streetName',
        'streetNumber',
        'streetLetter',
        'streetZipCode',
        'streetCity',
        'age',
        'gender',
      ],
    };

    // Merge default options with user options
    options = this.mergeOptions(defaultOptions, options);

    // Upper Camel Case every `contactField`
    _.forEach(options.contactFields, (constactField, index) => {
      options.contactFields[index] = _.upperFirst(constactField)
    });

    const searchQuery = {};

    // Convert contactFields to comma separated string and add it to the `searchQuery`
    searchQuery.ContactFields = _.join(options.contactFields, ',');

    // Convert contactFields to comma separated string and add it to the `searchQuery`
    if (_.isArray(options.analyzeFields) && !_.isEmpty(options.analyzeFields))
      searchQuery.AnalyzeFields = _.join(options.analyzeFields, ',');


    this.getMulti({
      maxResults: 2,
      search: options.search,
    }, (err, records) => {
      if (err) {
        return callbacks(callback, [err, null]);
      }

      // If search returned more then one record
      if (records.length >= 2) {
        return callbacks(callback, [this.messages.getSingle.toMany, null]);
      }

      if (!records.length) {
        return callbacks(callback, [null, {}]);
      }

      if (!_.isEmpty(records[0].firstName)) searchQuery.FirstName = records[0].firstName;
      if (!_.isEmpty(records[0].middleName)) searchQuery.MiddleName = records[0].middleName;
      if (!_.isEmpty(records[0].lastName)) searchQuery.LastName = records[0].lastName;
      if (!_.isEmpty(records[0].addressName)) searchQuery.AddressName = records[0].addressName;
      if (!_.isEmpty(records[0].addressNumber)) searchQuery.AddressNumber = records[0].addressNumber;
      if (!_.isEmpty(records[0].addressLetter)) searchQuery.AddressLetter = records[0].addressLetter;
      if (!_.isEmpty(records[0].zipCode)) searchQuery.ZipCode = records[0].zipCode;
      if (!_.isEmpty(records[0].city)) searchQuery.City = records[0].city;
      if (!_.isEmpty(records[0].mobile)) searchQuery.Mobile = records[0].mobile;
      if (!_.isEmpty(records[0].phone)) searchQuery.Phone = records[0].phone;

      const request = require('request');

      request({
        method: 'GET',
        url: `https://api.bas.no/recordlinking/v2/Single/${options.washDegree}`,
        headers: {
          'cache-control': 'no-cache',
          'x-bdn-account': this.apiAccount,
          'x-bdn-key': this.apiKey,
        },
        qs: searchQuery,
        json: true
      }, (err, response, body) => {
        if (err) {
          return callbacks(callback, [err, null]);
        }

        if (response.statusCode === 401) {
          return callbacks(callback, [this.messages.wrongCredentials, null]);
        }

        if (response.statusCode !== 200) {
          return callbacks(callback, [body, null]);
        }

        const constructedRecord = {};

        _.forEach(body, function (value, key) {
          key = _.camelCase(key);
          constructedRecord[key] = value;
        });


        return callbacks(callback, [null, constructedRecord]);
      });
    });
  }

  /**
   * GetMulti
   * Get multiple records matching search
   * @param {object} options
   * @param {function} callback
   * @callback(error, records)
   */
  getMulti(options, callback) {
    if (!this.authorized()) {
      return callbacks(callback, [this.messages.unauthorized, null]);
    }

    const defaultOptions = {
      maxResults: 20,
    };

    options = this.mergeOptions(defaultOptions, options);

    if (_.isUndefined(options.search)) {
      return callbacks(callback, [this.messages.getMulti.noSearch, null]);
    }

    const searchQuery = {};

    if (_.isEmpty(options.search.fulltext)) {
      if (!_.isEmpty(options.search.firstName)) searchQuery.FirstName = options.search.firstName;
      if (!_.isEmpty(options.search.middleName)) searchQuery.MiddleName = options.search.middleName;
      if (!_.isEmpty(options.search.lastName)) searchQuery.LastName = options.search.lastName;
      if (!_.isEmpty(options.search.addressName)) searchQuery.AddressName = options.search.addressName;
      if (!_.isEmpty(options.search.addressNumber)) searchQuery.AddressNumber = options.search.addressNumber;
      if (!_.isEmpty(options.search.addressLetter)) searchQuery.AddressLetter = options.search.addressLetter;
      if (!_.isEmpty(options.search.zipCode)) searchQuery.ZipCode = options.search.zipCode;
      if (!_.isEmpty(options.search.city)) searchQuery.City = options.search.city;
      if (!_.isEmpty(options.search.mobile)) searchQuery.Mobile = options.search.mobile;
      if (!_.isEmpty(options.search.phone)) searchQuery.Phone = options.search.phone;
      if (!_.isEmpty(options.search.companyName)) searchQuery.CompanyName = options.search.companyName;
      if (!_.isEmpty(options.search.companyOrgNo)) searchQuery.CompanyOrgNo = options.search.companyOrgNo;
    } else {
      searchQuery.Fulltext = options.search.fulltext;
    }

    const request = require('request');

    request({
      method: 'GET',
      url: `https://api.bas.no/recordlinking/v2/Multi/${options.maxResults}`,
      headers: {
        'cache-control': 'no-cache',
        'x-bdn-account': this.apiAccount,
        'x-bdn-key': this.apiKey,
      },
      qs: searchQuery,
      json: true
    }, (err, response, body) => {
      if (err) {
        return callbacks(callback, [err, null]);
      }

      if (response.statusCode === 401) {
        return callbacks(callback, [this.messages.wrongCredentials, null]);
      }

      if (response.statusCode !== 200) {
        return callbacks(callback, [body, null]);
      }

      const constructedRecords = [];
      _.forEach(body, function (record) {
        const newRecordObject = {};

        _.forEach(record, function (value, key) {
          key = _.camelCase(key);
          newRecordObject[key] = value;
        });

        constructedRecords.push(newRecordObject);

      });

      return callbacks(callback, [null, constructedRecords]);
    });

  }

  /**
   * Authorized
   * Returns if API key and account has been set.
   * @private
   * @return {Boolean}
   */
  authorized() {
    return !!(this.apiKey && this.apiAccount);
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

module.exports = new RecordLinking;
