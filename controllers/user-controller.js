/* globals module */
"user strict";

module.exports = function(data) {
    return {
        getProfile(req, res) {
            if (!req.user) {
                return res.redirect("/login");
            }
            res.render("profile", {
                model: req.user,
                user: req.user
            });
        },
        changeProfile(req, res) {
            if (!req.user) {
                return res.redirect("/login");
            }
            let userdata = {
                name: req.body.name,
                email: req.body.email,
                password: req.body.password,
                _id: req.user._id
            };
            data.updateUser(userdata)
                .then(() => {
                    res.redirect("/home", {
                        user: req.user
                    });
                });
        }
    }
}