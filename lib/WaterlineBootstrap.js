var _ = require('lodash'), Waterline = require('waterline');

module.exports = function bootstrap( options, cb ) {

  var adapters = options.adapters || {};
  var connections = options.connections || {};
  var collections = options.collections || {};

  _(adapters).each(function (def, identity) {
    def.identity = def.identity || identity;
  });

  var extendedCollections = [];
  _(collections).each(function (def, identity) {

    def.identity = def.identity || identity;

    extendedCollections.push(Waterline.Collection.extend(def));
  });

  var waterline = new Waterline();
  extendedCollections.forEach(function (collection) {
    waterline.loadCollection(collection);
  });

  waterline.initialize({
    adapters: adapters,
    connections: connections
  }, cb);

  return waterline;
};