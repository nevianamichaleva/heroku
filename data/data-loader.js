/* globals module require global __dirname */
"use strict";

const mongoose = require("mongoose");

const path = require("path"),
    fs = require("fs");

module.exports = function(config) {
    mongoose.Promise = global.Promise;

    var connectionString = config.connectionString["development"];
    if (process.env.NODE_ENV === 'production') {
        connectionString = config.connectionString["production"];
    }
    mongoose.connect(connectionString);
    let User = require("../models/user-model.js");
    let Client = require("../models/client-model.js");
    let CompanySettings = require("../models/companysettings-model.js");
    let Product = require("../models/product-model.js");
    let Invoice = require("../models/invoice-model.js");
    let models = { User, Client, CompanySettings, Product, Invoice };
    let data = {};

    fs.readdirSync("./data")
        .filter(file => file.includes("-data"))
        .forEach(file => {
            let dataModule = require(path.join(__dirname, file))(models);
            Object.keys(dataModule)
                .forEach(key => {
                    data[key] = dataModule[key];
                });
        });
    return data;
};