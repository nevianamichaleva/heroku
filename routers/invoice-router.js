/* globals module require */
"use strict";

const express = require("express");

module.exports = function(app, controllers) {
    let controller = controllers.invoice;

    let router = new express.Router();

    router
        .get("/", controller.getInvoice)
        .get("/all", controller.getAllInvoices)
        .get("/:id", controller.getInvoiceById)
        .get("/remove/:id", controller.getInvoiceByIdAndRemove)
        .post("/", controller.createInvoice)
        .put("/:id", controller.updateInvoice);

    app.use("/invoice", router);
};