'use strict';

angular.module('hotel-search-engine')
    .factory('Hotel', ['$resource', function ($resource) {
        return $resource('api/hotels/:id', {}, {
            'query': {method: 'GET', isArray: true},
            'get': {method: 'GET'},
            'update': {method: 'PUT'}
        });
    }])
    .factory('Booking', ['$resource', function ($resource) {
        return $resource('api/bookings/:id', {}, {
            'query': {method: 'GET', isArray: true},
            'get': {method: 'GET'},
            'update': {method: 'PUT'}
        });
    }])
    .factory('Search', ['$resource', function ($resource) {
        return $resource('api/search', {}, {
            'query': {method: 'GET', isArray: true}
        });
    }])
    .factory('City', ['$resource', function ($resource) {
        return $resource('api/cities', {}, {
            'query': {method: 'GET', isArray: true}
        });
    }]);
