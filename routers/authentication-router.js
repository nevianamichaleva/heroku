/* globals module require */
"use strict";

const express = require("express"),
    expressValidator = require("express-validator"),
    passport = require("passport");

module.exports = function(app, controllers) {
    let controller = controllers.authentication;

    let router = new express.Router();


    app.use(expressValidator());

    router
        .get("/login", controller.getLogin)
        .get("/register", controller.getRegister)
        .get("/login/facebook/callback",
            passport.authenticate('facebook', {
                successRedirect: '/',
                failureRedirect: '/home'
            }))
        .post("/login",
            passport.authenticate('local-login', {
                failureRedirect: '/login',
                passReqToCallback: true,
                failureFlash: true
            }),
            controller.login)
        .post("/register", controller.register)
        .get("/logout", controller.logout);

    app.use(router);
};