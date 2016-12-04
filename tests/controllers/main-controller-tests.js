/* globals require describe it */
"use strict";

const { expect } = require("chai"),
    httpMocks = require('node-mocks-http');

const username = "author",
    user = {
        username
    };

describe("Test main controller", () => {
    let controller = require("../../controllers/main-controller")();

    describe("getHome()", () => {
        it("Expect to make correct view rendering", () => {
            let view = "carousel";

            let requset = httpMocks.createRequest({
                    user
                }),
                response = httpMocks.createResponse();

            controller.getHome(requset, response);

            let actualView = response._getRenderView();
            expect(actualView).to.equal(view);
        });

        it("Expect to make view rending with correct user", () => {
            let requset = httpMocks.createRequest({
                    user
                }),
                response = httpMocks.createResponse();

            controller.getHome(requset, response);

            let actualUser = response._getRenderData().user;
            expect(actualUser).to.eql(user);
        });
    });

    describe("getAboutUs()", () => {
        it("Expect to make correct view rendering", () => {
            let view = "about";

            let requset = httpMocks.createRequest({
                    user
                }),
                response = httpMocks.createResponse();

            controller.getAboutUs(requset, response);

            let actualView = response._getRenderView();
            expect(actualView).to.equal(view);
        });

        it("Expect to make view rending with correct user", () => {
            let requset = httpMocks.createRequest({
                    user
                }),
                response = httpMocks.createResponse();

            controller.getAboutUs(requset, response);

            let actualUser = response._getRenderData().user;
            expect(actualUser).to.eql(user);
        });
    });

    describe("getUser()", () => {
        it("Expect to make correct view rendering", () => {
            let view = "user";

            let requset = httpMocks.createRequest({
                    user
                }),
                response = httpMocks.createResponse();

            controller.getUser(requset, response);

            let actualView = response._getRenderView();
            expect(actualView).to.equal(view);
        });

        it("Expect to make view rending with correct user", () => {
            let requset = httpMocks.createRequest({
                    user
                }),
                response = httpMocks.createResponse();

            controller.getUser(requset, response);

            let actualUser = response._getRenderData().user;
            expect(actualUser).to.eql(user);
        });
    });
});