/* globals module require */
"use strict";

const express = require("express"),
    multer = require('multer');
module.exports = function(app, controllers) {
    let controller = controllers.company;

    let router = new express.Router();

    router
        .get("/", controller.checkCompanySettings)
        .get("/create", controller.getBlankCompanySettings)
        .get("/settings", controller.getCompanySettings)
        .post("/create", multer({ dest: './uploads/' }).single('upl'), controller.createCompanySettings)
        .post("/settings", multer({ dest: './uploads/' }).single('upl'), controller.changeCompanySettings)

    app.use("/company", router);
};