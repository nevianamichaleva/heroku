/* globals module require */
"use strict";

const express = require("express");

module.exports = function(app, controllers) {
    let controller = controllers.client;

    let router = new express.Router();

    router
        .get("/search/:pattern", controller.getClientByPattern)
        .get("/:id", controller.getClientById)

    app.use("/client", router);
};