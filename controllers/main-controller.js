/* globals module */
"user strict";

module.exports = function() {
    return {
        getHome(req, res) {
            res.render("carousel", {
                user: req.user
            });
        },
        getAboutUs(req, res) {
            res.render("about", {
                user: req.user
            });
        },
        getUser(req, res) {
            res.render("user", {
                user: req.user
            });
        }
    };
};