/* globals require module */
"use strict";

const constants = require("../../config/constants");

module.exports = {
    checkInvoiceNumber(number) {
        return number.length === constants.invoiceNumberLength;
    },
    checkIdentity(identity) {
        return identity.length >= constants.minIdentityLength &&
            identity.length <= constants.maxIdentityLength;
    },
    checkCompanyName(companyName) {
        return companyName.length >= constants.minCompanyNameLength &&
            companyName.length <= constants.maxCompanyNameLength;
    },
    checkClientName(clientName) {
        return clientName.length >= constants.minClientNameLength &&
            clientName.length <= constants.maxClientNameLength;
    },
    checkProductNameLength(productName) {
        return productName.length >= constants.minProductNameLength &&
            productName.length <= constants.maxProductNameLength;
    },
    checkUsername(username) {
        return username.length >= constants.minUsernameLength &&
            username.length <= constants.maxUsernameLength;
    }
};