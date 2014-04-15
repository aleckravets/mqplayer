'use strict';

angular.module('Player', ['Directives'])
    .directive('player', ['$rootScope', 'PlayerService', function($rootScope, PlayerService) {
        return {
            restrict: 'E',
            scope: {},
            controller: function($scope, $element) {
                $scope.audio = new Audio();
                $scope.items = PlayerService.items;
                $scope.currentItem = null;

                $scope.playpause = function() {
                    if ($scope.audio.paused) {
                        if (!$scope.items)
                            return;

                        if (!$scope.currentItem) {
                            $scope.currentItem = $scope.items[0];
                            $scope.audio.src = 'proxy.php?get=' + $scope.currentItem.href;
                        }

                        $scope.audio.play();
                    }
                    else {
                        $scope.audio.pause();
                    }
                };

                $scope.stop = function() {
                    $scope.audio.pause();
                    $scope.src = '';
                }
            },

            templateUrl: 'player.html'
        };
    }])
    .factory('PlayerService', function() {
        var items = [];

        return {
            items: items
        };
    })
;