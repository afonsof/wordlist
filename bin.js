#!/usr/bin/env node

var appModule = require("./lib/app");
var wr = require("./lib/wordRepo");

var setupWaterline = require('./lib/waterline-bootstrap');
setupWaterline({
    adapters: {
        'sails-disk': require('sails-disk')
    },
    collections: {
        word: {
            connection: 'tmp',
            attributes: {
                name: 'string',
                know: 'boolean'
            }
        }
    },
    connections: {
        tmp: {
            adapter: 'sails-disk'
        }
    }
}, function waterlineReady(err, ontology) {
    if (err) throw err;
    main(ontology);
});

function main(wl) {
    var app = new appModule.App(new wr.WordRepo(wl));
    app.processConsole();
}