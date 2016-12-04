/* globals module require */
"use strict";

const express = require("express");

module.exports = function(app, controllers) {
    let controller = controllers.user;

    let router = new express.Router();

    router
        .get("/profile", controller.getProfile)
        .post("/profile", controller.changeProfile);

    app.use("/user", router);
};