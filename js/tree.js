'use strict';

angular.module('Tree', ['Services'])
    .controller('TreeCtrl', ['$scope', 'Data', 'PlayerService', function($scope, Data, PlayerService) {
        Data.query({path: '/'}, function (data){
            $scope.items = data;
        });

        var selectedItems = [];

        $scope.toggleDir = function(item) {
            if (item.items == undefined) {
                Data.query({path: item.href }, function (data){
                    item.items = data;
                });
                item.collapsed = false;
            }
            else {
                item.collapsed = !item.collapsed;
            }
        };

        $scope.select = function($event, item) {
            for (var i = 0; i < selectedItems.length; i++) {
                selectedItems[i].selected = false;
            }

            item.selected = !item.selected;

            if (item.selected)
                selectedItems.push(item);
        };

        $scope.enqueue = function(item) {
            if (!/\.mp3/.test(item.href))
                return;

            PlayerService.items.push(item);
//            document.getElementById('audio').src = 'proxy.php?get=' + encodeURIComponent(item.href);
//            document.getElementById('audio').play();
            //angular.element('audio').attr('src', 'proxy.php?get=' + href);
        }

        $scope.play = function($event, item) {
            if (item.resourceType == 'dir') {

            }
            else {
                PlayerService.play(item);
            }
        }
    }]);