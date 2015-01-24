#!/usr/bin/env node

var App = require("./lib/App");
var WordRepo = require("./lib/WordRepo");
var db = require("./api/models");

function main(wl) {
    var app = new App(new WordRepo(wl));
    app.processConsole();
}

main(db);