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
		var name = ap.arg(1).toLowerCase();
		wl.collections.word.count({ name: name }).exec(function(err, count) {
			if( count > 0 ) {
				wl.collections.word.update({ name: name }, { know: ap.opt("iknow") }).exec(function(err, users) {
					console.log("This word already exists and was updated.");
				});
				return;
			}
				
			wl.collections.word
				.create({ name: name, know: ap.opt("iknow") })
				.exec(function(err, user) {});
		});
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
