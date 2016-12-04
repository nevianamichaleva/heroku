"use strict";
const helmet = require("helmet"),
    ienoopen = require('ienoopen'),
    dontSniffMimeTypes = require("dont-sniff-mimetype"),
    frameguard = require("frameguard");

module.exports = function(app) {
    app.use(helmet());
    app.use(ienoopen());
    app.use(dontSniffMimeTypes());
    app.use(frameguard({ acttion: "deny" }));

    app.disable("x-powered-by");

}