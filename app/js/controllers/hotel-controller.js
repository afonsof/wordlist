'use strict';

angular.module('hotel-search-engine')
    .controller('HotelController', ['$scope', '$modal', 'resolvedHotel', 'Hotel',
        function ($scope, $modal, resolvedHotel, Hotel) {

            $scope.hotels = resolvedHotel;

            $scope.create = function () {
                $scope.clear();
                $scope.open();
            };

            $scope.update = function (id) {
                $scope.hotel = Hotel.get({id: id});
                $scope.open(id);
            };

            $scope.delete = function (id) {
                Hotel.delete({id: id},
                    function () {
                        $scope.hotels = Hotel.query();
                    });
            };

            $scope.save = function (id) {
                if (id) {
                    Hotel.update({id: id}, $scope.hotel,
                        function () {
                            $scope.hotels = Hotel.query();
                            $scope.clear();
                        });
                } else {
                    Hotel.save($scope.hotel,
                        function () {
                            $scope.hotels = Hotel.query();
                            $scope.clear();
                        });
                }
            };

            $scope.clear = function () {
                $scope.hotel = {
                    "name": "",
                    "nightly": "",
                    "id": ""
                };
            };

            $scope.open = function (id) {
                var hotelSave = $modal.open({
                    templateUrl: 'hotel-save.html',
                    controller: 'HotelSaveController',
                    resolve: {
                        hotel: function () {
                            return $scope.hotel;
                        }
                    }
                });

                hotelSave.result.then(function (entity) {
                    $scope.hotel = entity;
                    $scope.save(id);
                });
            };
        }])
    .controller('HotelSaveController', ['$scope', '$modalInstance', 'hotel',
        function ($scope, $modalInstance, hotel) {
            $scope.hotel = hotel;


            $scope.ok = function () {
                $modalInstance.close($scope.hotel);
            };

            $scope.cancel = function () {
                $modalInstance.dismiss('cancel');
            };
        }]);
