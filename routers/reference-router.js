/* globals module require */
"use strict";

const express = require("express");

module.exports = function(app, controllers) {
    let controller = controllers.reference;

    let router = new express.Router();

    router
        .get("/", controller.getReference)
        .get("/place", controller.getPlace)
        .get("/contragent", controller.getContragent)
        .get("/product", controller.getProduct)
        .get("/period", controller.getInvoicesBetweenDates)

    app.use("/reference", router);
    return router;
};