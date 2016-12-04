/* globals module require */
"use strict";

const express = require("express");

module.exports = function(app, data) {
    let controller = require("../controllers/main-controller")(data);

    let router = new express.Router();

    router
        .get("/", (req, res) => {
            res.redirect("/home");
        })
        .get("/home", controller.getHome)
        .get("/user", controller.getUser)
        .get("/about", controller.getAboutUs);

    app.use(router);
};