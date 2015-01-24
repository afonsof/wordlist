// Declare app level module which depends on filters, and services
angular.module('hotel-search-engine', ['ngResource', 'ngRoute', 'ui.bootstrap', 'ui.date', 'angucomplete'])
    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider
            .when('/search', {
                templateUrl: 'views/search.html',
                controller: 'SearchController'
            })
            .when('/hotels', {
                templateUrl: 'views/hotels.html',
                controller: 'HotelController',
                resolve: {
                    resolvedHotel: ['Hotel', function (Hotel) {
                        return Hotel.query();
                    }]
                }
            })
            .otherwise({redirectTo: '/search'});
    }]);
