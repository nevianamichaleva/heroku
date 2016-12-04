"use strict";

module.exports = function(passport, userModel) {
    const LocalStrategy = require('passport-local');

    passport.use("local-login", new LocalStrategy({
        username: 'username',
        password: 'password',
        passReqToCallback: true
    }, function(req, username, password, done) {
        userModel.findOne({
                username: username
            },
            function(err, user) {
                if (err) {
                    //console.log('dsddsds');
                    return done(null, false, {
                        success: false,
                        message: "Incorrect username"
                    });
                }
                if (!user) {
                    return done(null, false, req.flash('signupMessage', 'Невалидно потребителско име'));
                }
                if (!user.validPassword(password)) {
                    return done(null, false, req.flash('signupMessage', 'Невалидна парола'));
                }
                return done(null, user);
            });
    }));
}