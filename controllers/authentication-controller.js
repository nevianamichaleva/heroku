"user strict";

const validator = require("./utils/validator");

module.exports = function(data) {
    return {
        name: "authentication",
        getLogin(req, res) {
            res.render("login", { message: req.flash('signupMessage') });
        },
        getRegister(req, res) {
            res.render("register");
        },
        login(req, res) {
            res.redirect("/company");
        },
        register(req, res) {

            let user = {
                name: req.body.name,
                username: req.body.username,
                email: req.body.email,
                password: req.body.password
            };

            var errors = validator.validateRegister(req);

            if (errors) {
                return res.render("register", {errors,
                                        model: {
                                            name: user.name,
                                            email: user.email,
                                            username: user.username }
                });
            }

            data.createUser(user)
            .then(() => {
                    res.redirect("/login");
                })
            .catch(err => {
                //TODO
                console.log(err);
            })

            return;
        },
        logout(req, res) {
            req.logout();
            res.redirect("/home");
        },
        facebookRegister(req, res) {
            res.redirect("/company");
        }
    }
}