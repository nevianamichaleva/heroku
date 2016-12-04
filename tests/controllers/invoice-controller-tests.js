/* globals require describe it beforeEach afterEach */
"use strict";

const { expect } = require("chai"),
    sinonModule = require("sinon"),
    httpMocks = require('node-mocks-http'),
    events = require('events');

const username = "author",
    user = {
        username
    },
    userId = 1,
    invoice = {
        _id: userId,
        number: "0123456789",
        user: username
    },
    invoices = [invoice];


describe("Test invoices controller", () => {
    let sinon;

    beforeEach(() => {
        sinon = sinonModule.sandbox.create();
    });

    let data = {
        getAllInvoices() {},
        getInvoiceById() {},
        createInvoice() {},
        updateInvoice() {},
        createClient() {},
        createProduct() {}
    };

    let controller = require("../../controllers/invoice-controller")(data);

    describe("getInvoice()", () => {
        it("Expect to make correct view rendering", () => {
            let view = "invoice";

            let requset = httpMocks.createRequest(),
                response = httpMocks.createResponse();

            controller.getInvoice(requset, response);

            let actualView = response._getRenderView();
            expect(actualView).to.equal(view);
        });
    });

    describe("getAllInvoices()", () => {
        beforeEach(() => {
            sinon.stub(data, "getAllInvoices", () => {
                let count = invoices.length;
                return Promise.resolve({ invoices, count });
            });
        });

        afterEach(() => {
            sinon.restore();
        });

        it("Еxpect to make correct view rendering", done => {
            let view = "invoice-list";

            let requset = httpMocks.createRequest({
                    user
                }),
                response = httpMocks.createResponse({
                    eventEmitter: events.EventEmitter
                });

            response.on('end', function() {
                let actualView = response._getRenderView();
                expect(actualView).to.equal(view);
                done();
            });

            controller.getAllInvoices(requset, response);
        });

        it("Expect to make view rending with correct model", done => {
            let requset = httpMocks.createRequest({
                    user
                }),
                response = httpMocks.createResponse({
                    eventEmitter: events.EventEmitter
                });

            response.on('end', function() {
                let actualModel = response._getRenderData().model;
                expect(actualModel).to.eqls(invoices);
                done();
            });

            controller.getAllInvoices(requset, response);
        });

        it("Expect to make view rending with correct user", done => {
            let requset = httpMocks.createRequest({
                    user
                }),
                response = httpMocks.createResponse({
                    eventEmitter: events.EventEmitter
                });

            response.on('end', function() {
                let actualUser = response._getRenderData().user;
                expect(actualUser).to.eql(user);
                done();
            });

            controller.getAllInvoices(requset, response);
        });

        it("Expect to make correct redirect, when haven't user", () => {
            let redirectUrl = "/login";

            let requset = httpMocks.createRequest(),
                response = httpMocks.createResponse({
                    eventEmitter: events.EventEmitter
                });

            response.on('end', function() {
                let actualRedirectUrl = response._getRedirectUrl();
                expect(actualRedirectUrl).to.equal(redirectUrl);
            });

            controller.getAllInvoices(requset, response);
        });
    });

    describe("getInvoiceById()", () => {
        beforeEach(() => {
            sinon.stub(data, "getInvoiceById", id => {
                let currentInvoice = invoices.find(iv => iv._id === id);
                return Promise.resolve(currentInvoice);
            });
        });

        afterEach(() => {
            sinon.restore();
        });

        it("Expect to make correct view rendering", done => {
            let view = "user-invoice";

            let requset = httpMocks.createRequest({
                    user,
                    params: {
                        id: userId
                    }
                }),
                response = httpMocks.createResponse({
                    eventEmitter: events.EventEmitter
                });

            response.on('end', function() {
                let actualView = response._getRenderView();
                expect(actualView).to.equal(view);
                done();
            });

            controller.getInvoiceById(requset, response);
        });

        it("Expect to make view rending with correct model", done => {
            let requset = httpMocks.createRequest({
                    user,
                    params: {
                        id: userId
                    }
                }),
                response = httpMocks.createResponse({
                    eventEmitter: events.EventEmitter
                });

            response.on('end', function() {
                let actualModel = response._getRenderData().model;
                expect(actualModel).to.eqls(invoice);
                done();
            });

            controller.getInvoiceById(requset, response);
        });

        it("Expect to make view rending with correct user", done => {
            let requset = httpMocks.createRequest({
                    user,
                    params: {
                        id: userId
                    }
                }),
                response = httpMocks.createResponse({
                    eventEmitter: events.EventEmitter
                });

            response.on('end', function() {
                let actualUser = response._getRenderData().user;
                expect(actualUser).to.eql(user);
                done();
            });

            controller.getInvoiceById(requset, response);
        });

        it("Expect to make correct redirect, when haven't user", () => {
            let redirectUrl = "/login";

            let requset = httpMocks.createRequest({
                    params: {
                        id: userId
                    }
                }),
                response = httpMocks.createResponse({
                    eventEmitter: events.EventEmitter
                });

            response.on('end', function() {
                let actualRedirectUrl = response._getRedirectUrl();
                expect(actualRedirectUrl).to.equal(redirectUrl);
            });

            controller.getInvoiceById(requset, response);
        });
    });

    describe("createInvoice()", () => {
        beforeEach(() => {
            sinon.stub(data, "createInvoice", function(currentInvoice) {
                return Promise.resolve(currentInvoice);
            });

            sinon.stub(data, "createClient", () => {
                Promise.resolve();
            });

            sinon.stub(data, "createProduct", () => {
                Promise.resolve();
            })
        });

        afterEach(() => {
            sinon.restore();
        });

        it("Expect to send status code 201, when the invoice data is correct", done => {
            let invoice = {
                number: "0123456789",
                client: {

                },
                products: []
            };

            let requset = httpMocks.createRequest({
                    user,
                    body: invoice
                }),
                response = httpMocks.createResponse({
                    eventEmitter: events.EventEmitter
                });

            response.on('end', function() {
                let actualStatusCode = response._getStatusCode();
                expect(actualStatusCode).to.equal(201);
                done();
            })

            controller.createInvoice(requset, response);
        });

        it("Expect to send status code 401, when haven't user", () => {
            let invoice = {
                number: "0123456789",
                client: {

                },
                products: []
            };

            let requset = httpMocks.createRequest({
                    body: invoice
                }),
                response = httpMocks.createResponse({
                    eventEmitter: events.EventEmitter
                });

            response.on('end', function() {
                let actualStatusCode = response._getStatusCode();
                expect(actualStatusCode).to.equal(401);
            })

            controller.createInvoice(requset, response);
        });

        it("Expect to send status code 400, when invoice number is invalid", done => {
            let invoice = {
                number: "012345678",
                client: {

                },
                products: []
            };

            let requset = httpMocks.createRequest({
                    user,
                    body: invoice
                }),
                response = httpMocks.createResponse({
                    eventEmitter: events.EventEmitter
                });

            response.on('end', function() {
                let actualStatusCode = response._getStatusCode();
                expect(actualStatusCode).to.equal(400);
                done();
            })

            controller.createInvoice(requset, response);
        });
    });

    describe("updateInvoice()", () => {
        beforeEach(() => {
            sinon.stub(data, "updateInvoice", function(currentInvoice) {
                return Promise.resolve(currentInvoice);
            });

            sinon.stub(data, "createClient", () => {
                Promise.resolve();
            })

            sinon.stub(data, "createProduct", () => {
                Promise.resolve();
            })
        });

        afterEach(() => {
            sinon.restore();
        });

        it("Expect to send status code 201, when the invoice data is correct", done => {
            let invoice = {
                number: "0123456789",
                client: {

                },
                products: []
            };

            let requset = httpMocks.createRequest({
                    user,
                    body: invoice,
                    params: {
                        id: userId
                    }
                }),
                response = httpMocks.createResponse({
                    eventEmitter: events.EventEmitter
                });

            response.on('end', function() {
                let actualStatusCode = response._getStatusCode();
                expect(actualStatusCode).to.equal(201);
                done();
            })

            controller.updateInvoice(requset, response);
        });

        it("Expect to send status code 401, when haven't user", () => {
            let invoice = {
                number: "0123456789",
                client: {

                },
                products: []
            };

            let requset = httpMocks.createRequest({
                    body: invoice,
                    params: {
                        id: userId
                    }
                }),
                response = httpMocks.createResponse({
                    eventEmitter: events.EventEmitter
                });

            response.on('end', function() {
                let actualStatusCode = response._getStatusCode();
                expect(actualStatusCode).to.equal(401);
            })

            controller.updateInvoice(requset, response);
        });

        it("Expect to send status code 400, when invoice number is invalid", done => {
            let invoice = {
                number: "012345678",
                client: {

                },
                products: []
            };

            let requset = httpMocks.createRequest({
                    user,
                    body: invoice
                }),
                response = httpMocks.createResponse({
                    eventEmitter: events.EventEmitter
                });

            response.on('end', function() {
                let actualStatusCode = response._getStatusCode();
                expect(actualStatusCode).to.equal(400);
                done();
            })

            controller.updateInvoice(requset, response);
        })
    });
});