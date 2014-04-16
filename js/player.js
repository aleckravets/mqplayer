'use strict';

angular.module('Player', ['Directives'])
    .directive('player', ['$rootScope', 'PlayerService', function($rootScope, PlayerService) {
        return {
            restrict: 'E',
            scope: {},
            controller: function($scope, $element) {
                $scope.audio = PlayerService.audio;
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
        var audio = new Audio();
        var currentItem = null;

        function clear() {
            items.splice(0, items.length);
        }

        return {
            enqueue: function(item) {
                items.push(item)
            },
            next: function() {
                var i = items.indexOf(currentItem);
                if (i + 2 <= items.length) {
                    currentItem = items[i + 1];
                }
            },
            play: function() {
                if (items.length > 0)
                    audio.src = items[0];
            },
            playItem: function(item) {
                clear();
                items.push(item);
                //audio.src =
            },
            audio: audio,
            items: items
        };
    })
;