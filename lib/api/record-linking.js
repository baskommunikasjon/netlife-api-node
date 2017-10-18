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
 *  Background docs: https://api.bringcrm.no/recordlinking/v2/
 */

class RecordLinking {

  /**
   * Constructor
   * @constructor
   */
  constructor() {
    this.apiKey = null;
    this.apiAccount = null;

    this.messages = {
      // unauthorized: 'You have to authorize before using this API method.\nUse the `auth()` method.\n\n',
      // wrongCredentials: 'Wrong API credentials. Update settings in the `auth()` method.\n\n',
      // sendSingle: {
      //     recipient: 'The method `sendSingle()` requires a recipient.\nAdd this to the options.\n\n',
      //     message: 'The method `sendSingle()` requires a message.\nAdd this to the options.\n\n',
      //     smsFailed: 'Something went wrong - The SMS was not sent.\n\n',
      // },
      // sendBulk: {
      //     recipients: 'The method `sendBulk()` requires at least one recipient.\nAdd this to the options.\n\n',
      //     message: 'The method `sendBulk()` requires a message.\nAdd this to the options.\n\n',
      //     smsFailed: 'Something went wrong - The bulk-SMS was not sent.\n\n',
      // },
      // getShipment: {
      //     shipmentId: 'The method `getShipment()` requires a `shipmentId`.\nAdd this to the options.\n\n',
      // },
    }
  }
}

module.exports = new RecordLinking;
