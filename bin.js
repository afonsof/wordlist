#!/usr/bin/env node

function main(wl) {

	var ap = require('argparser')
				.nonvals("iknow")
				.err(function(e) {
				   console.log(e);
				   process.exit(0);
				 })
				.parse();

	if(ap.arg(0) == "add") {
		wl.collections.word.create({ name: ap.arg(1), know: ap.opt("iknow") }).exec(function(err, user) {});
	}
}

var setupWaterline = require('./waterline-bootstrap');
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
}, function waterlineReady (err, ontology) {
  if (err) throw err;
  main(ontology);
});
