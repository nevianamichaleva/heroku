/* globals require describe it beforeEach afterEach */
"use strict";

const { expect } = require("chai"),
    sinonModule = require("sinon");

describe("Test invoices data", () => {
    let sinon;

    beforeEach(() => {
        sinon = sinonModule.sandbox.create();
    });

    class User {
        constructor(props) {
            this.username = props.username;
            this.name = props.name;
            this.email = props.email;
            this.password = props.password;
        }

        save() {
            console.log(this.username); //Useless (only for eslint correct syntax)
        }

        generateHash(pass) {
            this.username = this.username; //Useless (only for eslint correct syntax)
            return pass;
        }

        static findByIdAndUpdate() {}
        static findOne() {}
    }

    let data = require("../../data/user-data")({ User });

    describe("createUser()", () => {
        beforeEach(() => {
            sinon.stub(User.prototype, "save", cb => {
                cb(null);
            });
        });

        afterEach(() => {
            sinon.restore();
        })

        it("Expect to save the user", done => {
            let user = {
                username: "username",
                name: "name",
                email: "random@email.dev",
                password: "password"
            };

            data.createUser(user)
                .then(actualUser => {
                    expect(actualUser).to.eql(user);
                    done();
                })
                .catch(err => {
                    console.log(err);
                });
        });
    });

    describe("updateUser()", () => {
        let userId = 1;

        let user = {
            _id: userId,
            username: "username",
            name: "name",
            email: "random@email.dev",
            password: "password"
        };

        let users = [user];

        beforeEach(() => {
            sinon.stub(User, "findByIdAndUpdate", (id, toUpdate, isNew, cb) => {
                let newUsername = toUpdate.$set.username;
                let currentUser = users.find(us => us._id === id);
                currentUser.username = newUsername;
                cb(null, currentUser);
            });
        });

        afterEach(() => {
            sinon.restore();
        });

        it("Expect to update user", done => {
            let newUsername = "nameuser",
                newData = {
                    _id: userId,
                    username: newUsername
                };

            data.updateUser(newData)
                .then(actualUser => {
                    expect(actualUser.username).to.equal(newUsername);
                    done();
                })
                .catch(err => {
                    console.log(err);
                });
        });
    });

    describe("getUserByUsername()", () => {
        let user = {
            _id: 1,
            username: "username",
            name: "name",
            email: "random@email.dev",
            password: "password"
        };

        let users = [user];

        beforeEach(() => {
            sinon.stub(User, "findOne", (query, cb) => {
                let currentUsername = query.username;
                let currentUser = users.find(us => us.username === currentUsername);
                cb(null, currentUser);
            });
        });

        afterEach(() => {
            sinon.restore();
        });

        it("Expect to return the user", done => {
            let username = "username";

            data.getUserByUsername(username)
                .then(actualUser => {
                    expect(actualUser).to.eql(user);
                    done();
                });
        });

        it("Expect to return null, when haven't user with current username", done => {
            let username = "wrongUsername";

            data.getUserByUsername(username)
                .then(actualUser => {
                    expect(actualUser).to.be.null;
                    done();
                });
        });
    });
});