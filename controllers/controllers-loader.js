/* module require __dirname */

const fs = require("fs"),
    path = require("path");

module.exports = function(data) {
    let controllers = {};
    fs.readdirSync(__dirname)
        .filter(file => file.includes("-controller"))
        .forEach(file => {
            let modulePath = path.join(__dirname, file);
            let theModule = require(modulePath)(data);
            let name = file.split("-")[0];
            controllers[name] = theModule;
        });
    return controllers;
};