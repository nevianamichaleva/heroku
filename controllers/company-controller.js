/* globals module */
"user strict";
var fs = require("fs");
const validator = require("./utils/validator");

module.exports = function(data) {
    return {
        checkCompanySettings(req, res) {
            if (!req.user) {
                return res.redirect("/login");
            }
            data.getCompanysettings(req.user._id)
                .then(company => {
                    if (company === null) {
                        return res.redirect("/company/create");
                    }
                    return res.redirect("/invoice/all");
                });
        },
        getBlankCompanySettings(req, res) {
            if (!req.user) {
                return res.redirect("/login");
            }
            res.render("company-details", {
                user: req.user
            });
        },
        getCompanySettings(req, res) {
            if (!req.user) {
                return res.redirect("/login");
            }
            data.getCompanysettings(req.user._id)
                .then(company => {
                    if (company === null) {
                        return res.status(404)
                            .redirect("/company/create");
                    }
                    return res.render("company-details", {
                        model: company,
                        user: req.user
                    });
                });
        },
        createCompanySettings(req, res) {
            if (!req.user) {
                return res.redirect("/login");
            }
            let companysettings = {
                name: req.body.name,
                bulstat: req.body.bulstat,
                useTax: req.body.useTax,
                city: req.body.city,
                address: req.body.address,
                accountablePerson: req.body.accountablePerson,
                email: req.body.email,
                phone: req.body.phone,
                user: req.user._id,
                logo: req.file
            };

            var errors = validator.validateCompany(req);
            if (errors) {
                return res.render("company-details", {errors,
                                        model: companysettings });
            }

            data.createCompanySettings(companysettings)
                .then(() => {
                    if (req.file != undefined) {
                        fs.unlink('../source/' + req.file.path, function(err) {
                            if (err) {
                                return console.error(err);
                            }
                        });
                    }
                    return res.redirect("/invoice");
                });
        },
        changeCompanySettings(req, res) {
            if (!req.user) {
                return res.redirect("/login");
            }
            let companysettings = {
                name: req.body.name,
                bulstat: req.body.bulstat,
                useTax: req.body.useTax,
                city: req.body.city,
                address: req.body.address,
                accountablePerson: req.body.accountablePerson,
                email: req.body.email,
                phone: req.body.phone,
                logo: req.file,
                _id: req.body._id
            };

            var errors = validator.validateCompany(req);
            if (errors) {
                return res.render("company-details", {errors,
                                        model: companysettings });
            }

            data.updateCompanysettings(req.body._id, companysettings)
                .then(() => {
                    if (req.file != undefined) {
                        fs.unlink('../source/' + req.file.path, function(err) {
                            if (err) {
                                return console.error(err);
                            }
                        });
                    }
                    return res.redirect("/invoice");
                });
        }
    };
};