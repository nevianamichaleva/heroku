/* globals module require */
"use strict";

const express = require("express");

module.exports = function(app, controllers) {
    let controller = controllers.product;

    let router = new express.Router();

    router
        .get("/search/:pattern", controller.getProductByPattern)

    app.use("/product", router);
};