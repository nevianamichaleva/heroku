/* globals require describe it beforeEach afterEach */
"use strict";

const { expect } = require("chai"),
    sinonModule = require("sinon");

describe("Test invoices data", () => {
    let sinon;

    beforeEach(() => {
        sinon = sinonModule.sandbox.create();
    });

    class Invoice {
        constructor(props) {
            this.number = props.number;
            this.user = props.user;
        }

        save() {
            console.log(this.number); //TODO: This is useless (only for eslint correct syntax)
        }

        static findByIdAndUpdate() {}
        static findById() {}
        static find() {}
    }

    let data = require("../../data/invoices-data")({ Invoice });

    describe("createInvoice()", () => {
        beforeEach(() => {
            sinon.stub(Invoice.prototype, "save", cb => {
                cb(null);
            });
        });

        afterEach(() => {
            sinon.restore();
        })

        it("Expect to save the invoice", done => {
            let number = "0123456789",
                user = "currentUser";

            data.createInvoice({ number, user })
                .then(actualInvoice => {
                    expect(actualInvoice.number).to.equal(number);
                    done();
                });
        });

        it("Expect to fail, when number is less than 10 symbols", done => {
            let number = "012345678",
                user = "currentUser";

            data.createInvoice({ number, user })
                .catch(err => {
                    expect(err).not.to.be.null;
                    done();
                });
        });

        it("Expect to fail, when number is greater than 10 symbols", done => {
            let number = "01234567891",
                user = "currentUser";

            data.createInvoice({ number, user })
                .catch(err => {
                    expect(err).not.to.be.null;
                    done();
                });
        });

        it("Expect to fail, when user is empty", done => {
            let number = "0123456789",
                user = "";

            data.createInvoice({ number, user })
                .catch(err => {
                    expect(err).not.to.be.null;
                    done();
                });
        });
    });

    describe("updateInvoice()", () => {
        let invoiceId = 1;

        let invoice = {
            _id: invoiceId,
            number: "1234567890"
        };

        let invoices = [invoice];

        beforeEach(() => {
            sinon.stub(Invoice, "findByIdAndUpdate", (id, toUpdate, isNew, cb) => {
                let newNumber = toUpdate.$set.number;
                let currentInvoice = invoices.find(iv => iv._id === id);
                currentInvoice.number = newNumber;
                cb(null, currentInvoice);
            });
        });

        afterEach(() => {
            sinon.restore();
        });

        it("Expect to update the invoice", done => {
            let newNumber = "9876543210",
                newData = {
                    number: newNumber,
                    user: "currentUser"
                };

            data.updateInvoice(invoiceId, newData)
                .then(newInvoice => {
                    expect(newInvoice.number).to.equal(newNumber);
                    done();
                });
        });

        it("Expect to fail, when new number is less then 10 symbols", done => {
            let newNumber = "987654321",
                newData = {
                    number: newNumber
                };

            data.updateInvoice(invoiceId, newData)
                .catch(err => {
                    expect(err).not.to.be.null;
                    done();
                });
        });

        it("Expect to fail, when number is greater then 10 symbols", done => {
            let newNumber = "98765432109",
                newData = {
                    number: newNumber
                };

            data.updateInvoice(invoiceId, newData)
                .catch(err => {
                    expect(err).not.to.be.null;
                    done();
                });
        });
    });

    describe("getInvoiceById()", () => {
        let invoiceId = 1;

        let invoice = {
            _id: invoiceId,
            number: "1234567890"
        };

        let invoices = [invoice];

        beforeEach(() => {
            sinon.stub(Invoice, "findById", (id, cb) => {
                let currentInvoice = invoices.find(iv => iv._id === id);
                cb(null, currentInvoice);
            });
        });

        afterEach(() => {
            sinon.restore();
        });

        it("Expect ot return the invoice", () => {
            data.getInvoiceById(invoiceId)
                .then(actualInvoice => {
                    expect(actualInvoice).to.eql(invoice);
                });
        });

        it("Expect to return null, when haven't invoice with current id", done => {
            data.getInvoiceById(2)
                .then(actualInvoice => {
                    expect(actualInvoice).to.be.null;
                    done();
                });
        });
    });

    describe("searchInvoicesByPlace()", () => {
        let place = "currentPlace",
            user = "currentUser";

        let invoice = {
            user,
            place,
            number: "1234567890"
        };

        let invoices = [invoice];

        beforeEach(() => {
            sinon.stub(Invoice, "find", (query, cb) => {
                let currentPlace = query.place,
                    currentUser = query.user;

                let currentInvoices = invoices.filter(iv => iv.place === currentPlace && iv.user === currentUser);
                cb(null, currentInvoices);
            });
        });

        afterEach(() => {
            sinon.restore();
        });

        it("Expect to return the matching invoices", done => {
            data.searchInvoicesByPlace(user, place)
                .then(actualInvoices => {
                    expect(actualInvoices).to.eql(invoices);
                    done();
                });
        });

        it("Expect to return empty array, when haven't invoice with current place", done => {
            data.searchInvoicesByPlace(user, "differentPlace")
                .then(actualInvoices => {
                    expect(actualInvoices).to.eql([]);
                    done();
                });
        });

        it("Expect to return empty array, when haven't invoice with current user", done => {
            data.searchInvoicesByPlace("wrongUser", place)
                .then(actualInvoices => {
                    expect(actualInvoices).to.eql([]);
                    done();
                });
        });

        it("Expect to fail, when haven't user", done => {
            data.searchInvoicesByPlace(null, place)
                .catch(err => {
                    expect(err).not.to.be.null;
                    done();
                });
        });
    });

    describe("searchInvoicesByContragent()", () => {
        let clientName = "currentClient",
            user = "currentUser";

        let invoice = {
            user,
            client: {
                name: clientName
            },
            number: "1234567890"
        };

        let invoices = [invoice];

        beforeEach(() => {
            sinon.stub(Invoice, "find", (query, cb) => {
                let currentClient = query["client.name"],
                    currentUser = query.user;

                let currentInvoices = invoices.filter(iv => iv.client.name === currentClient && iv.user === currentUser);
                cb(null, currentInvoices);
            });
        });

        afterEach(() => {
            sinon.restore();
        });

        it("Expect to return the matching invoices", done => {
            data.searchInvoicesByContragent(user, clientName)
                .then(actualInvoices => {
                    expect(actualInvoices).to.eql(invoices);
                    done();
                });
        });

        it("Expect to return empty array, when haven't invoice with current client name", done => {
            data.searchInvoicesByContragent(user, "differentClientName")
                .then(actualInvoices => {
                    expect(actualInvoices).to.eql([]);
                    done();
                });
        });

        it("Expect to return empty array, when haven't invoice with current user", done => {
            data.searchInvoicesByContragent("wrongUser", clientName)
                .then(actualInvoices => {
                    expect(actualInvoices).to.eql([]);
                    done();
                });
        });

        it("Expect to fail, when haven't user", done => {
            data.searchInvoicesByContragent(null, clientName)
                .catch(err => {
                    expect(err).not.to.be.null;
                    done();
                });
        });
    });
});