angular.module('hotel-search-engine')
    .controller('SearchController', ['$scope', 'Search', 'Booking', function ($scope, Search, Booking) {

        $scope.query = {};

        $scope.search = function () {
            $scope.query.city = $scope.query.cityInput.title;
            $scope.hotels = Search.query($scope.query);
        };

        $scope.book = function (hotel) {
            $scope.query.HotelId = hotel.id;

            Booking.save($scope.query,
                function () {
                    $scope.search();
                    alert('Reserva efetuada!');
                });
        };
    }]);
