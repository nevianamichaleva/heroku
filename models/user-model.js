/* globals require module String */
"use strict";

const mongoose = require("mongoose"),
     bcrypt = require("bcrypt-nodejs");

let userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        minlength: 6,
        maxlength: 50
    },
    name: String,
    email: {
        type: String,
        required: true
    },
    password: String
});

userSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
userSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.password);
};


mongoose.model("User", userSchema);
let UserModel = mongoose.model("User");
module.exports = UserModel;