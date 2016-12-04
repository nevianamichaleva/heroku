'use struct';

const passport = require('passport'),
    userModel = require('../../models/user-model.js');

passport.serializeUser((user, done) => {

    if (user) {
        return done(null, user._id);
    }

    return done(null, false);
});


passport.deserializeUser((userId, done) => {
    userModel.findOne({
        '_id': userId
    }, function (error, user) {
        if (user) {
            return done(null, user);
        }

        return done(null, false);
    });
});


require('./local-strategy.js')(passport, userModel);
require('./facebook-strategy')(passport, userModel);


module.exports = app => {
    app.use(passport.initialize());
    app.use(passport.session());
}