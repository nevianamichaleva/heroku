/* globals require module String */
"use strict";

const mongoose = require("mongoose");

let clientSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 2,
        maxlength: 50
    },
    identity: {
        type: String,
        required: true,
        minlength: 9,
        maxlength: 13
    },
    useTax: Boolean,
    city: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    email: String,
    accountablePerson: {
        type: String,
        required: true
    },
    phone: String,
    user: {
        type: String,
        required: true
    }
},
{
    toObject: {
        virtuals: true
    },
    toJSON: {
        virtuals: true
    }
});

clientSchema
    .virtual('zdds')
    .get(function() {
        return "BG" + this.identity;
    });

mongoose.model("Client", clientSchema);
let ClientModel = mongoose.model("Client");
module.exports = ClientModel;