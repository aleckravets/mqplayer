'use strict';

/* Directives */

angular.module('Disk.directives', ['Disk.services'])
    .directive('tree', function() {
        return {
            restrict: 'E',
            replace: true,
            scope: {
                model: '='
            },
            templateUrl: 'tree.html',
            controller: function($scope) {
                this.scope = $scope;
            }
        };
    })
    .directive('item', ['RecursionHelper', 'DiskData', function(RecursionHelper, DiskData) {
        return {
            restrict: 'E',
            replace: true,
            require: '^tree',
            scope: {
              model: '='
            },
            templateUrl: 'item.html',
            controller: function($scope) {
                $scope.toggle = function() {
                    if ($scope.items == undefined) {
                        DiskData.query({path: $scope.model.href }, function (data){
                            $scope.items = data;
                        });
                        $scope.collapsed = false;
                    }
                    else {
                        $scope.collapsed = !$scope.collapsed;
                    }
                };
                $scope.play = function() {
                    var href = $scope.model.href;

                    if (!/\.mp3/.test(href))
                        return;

                    document.getElementById('audio').src = 'proxy.php?get=' + href;
                    document.getElementById('audio').play();
                    //angular.element('audio').attr('src', 'proxy.php?get=' + href);
                }
            },
            link: function(scope, element, attrs, treeCtrl) {
            },
            compile: function(element) {
                return RecursionHelper.compile(element);
            }
        };
    }]);
