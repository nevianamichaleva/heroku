/* globals require module String */
"use strict";

const mongoose = require("mongoose");

let invoiceSchema = new mongoose.Schema({
    number: {
        type: String,
        required: true,
        length: 10
    },
    date: {
        type: Date,
        default: new Date()
    },
    place: String,
    company: {
        name: String,
        identity: String,
        address: String,
        city: String,
        accountablePerson: String,
        logo: String
    },
    client: {
        name: String,
        identity: String,
        address: String,
        city: String,
        accountablePerson: String
    },
    products: {
        type: [{
            name: String,
            price: Number,
            quantity: {
                type: Number,
                default: 0
            },
            unit: String
        }]
    },
    sum: Number,
    vat: Number,
    total: Number,
    dds: Number,
    user: {
        type: String,
        required: true
    }
});

mongoose.model("Invoice", invoiceSchema);
let InvoiceModel = mongoose.model("Invoice");
module.exports = InvoiceModel;