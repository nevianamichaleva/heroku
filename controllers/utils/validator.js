/* globals require module */
"use strict";

const constants = require("../../config/constants"),
        validator = require("../../data/utils/validator");

module.exports = {
    validateRegister(req)
    {
        req.checkBody('name', constants.emptyNameMessage).notEmpty();
        req.checkBody('username', constants.emptyUsernameMessage).notEmpty();
        req.checkBody('email', constants.emptyEmailMessage).notEmpty();
        req.checkBody('email', constants.wrongEmailMessage).isEmail();
        req.checkBody('password', constants.emptyPasswordMessage).notEmpty();
        req.checkBody('confirm', constants.emptyConfirmMessage).notEmpty();

        var errors = req.validationErrors();

        if (req.body.username && !validator.checkUsername(req.body.username)) {
            var tmpError =  {
                    param: "username",
                    msg: constants.wrongUsernameMessage,
                    value: ""
                };
            if (errors) {
                errors.push(tmpError);
            }
            else {
                errors = [tmpError];
            }
        }
        return errors;
    },
    validateCompany(req)
    {
        req.checkBody('name', constants.emptyCompanyNameMessage).notEmpty();
        req.checkBody('bulstat', constants.emptyIdentityMessage).notEmpty();
        req.checkBody('city', constants.emptyCityMessage).notEmpty();
        req.checkBody('address', constants.emptyAddressMessage).notEmpty();
        req.checkBody('accountablePerson', constants.emptyMOLMessage).notEmpty();
        req.checkBody('email', constants.wrongEmailMessage).isEmail();

        var errors = req.validationErrors();
        if (req.body.name && !validator.checkCompanyName(req.body.name)) {
                    var tmpError = {
                            param: "name",
                            msg: constants.wrongCompanyNameMessage,
                            value: ""
                        };
                    if (errors) {
                        errors.push(tmpError);
                    }
                    else {
                        errors = [tmpError];
                    }
                }
        if (req.body.bulstat && !validator.checkIdentity(req.body.bulstat)) {
                    var tmpError1 = {
                            param: "bulstat",
                            msg: constants.wrongIdentityMessage,
                            value: ""
                        }
                    if (errors) {
                        errors.push(tmpError1);
                    }
                    else {
                        errors = [tmpError1];
                    }
                }
        return errors;
    }
};