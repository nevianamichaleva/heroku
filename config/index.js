/* globals module */

module.exports = {
    port: process.env.PORT || 3001,
    connectionString: {
        development: "mongodb://localhost/invoicesDb",
        production: "mongodb://admin:Tyche7@ds159747.mlab.com:59747/invoice"
    },
    invoiceNumberLength: 10,
    minIdentityLength: 9,
    maxIdentityLength: 13,
    minCompanyNameLength: 2,
    maxCompanyNameLength: 50,
    minClientNameLength: 2,
    maxClientNameLength: 50,
    minProductNameLength: 2,
    maxProductNameLength: 100,
    minUsernameLength: 6,
    maxUsernameLength: 50,
    wrongInvoiceNumberMessage: "Моля въведете номер на фактура с 10 символа",
    wrongIdentityMessage: "Моля въведете ЕИК между 9 и 13 символа",
    wrongCompanyNameMessage: "Моля въведете Име на фирма между 2 и 50 символа",
    wrongUsernameMessage: "Моля въведете Потребителско име между 6 и 50 символа"
};