/*
 *  record-linking-api.js
 *  Background docs: https://api.bringcrm.no/recordlinking/v2/
 */

class RecordLinkingApi {

    /**
     * Constructor
     * @public
     */
    constructor() {
        this.xBdnKey = null;
        this.xBdnAccount = null;

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

module.exports = new RecordLinkingApi;