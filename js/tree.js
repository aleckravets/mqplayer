'use strict';

angular.module('Tree', ['Services', 'Player'])
    .controller('TreeCtrl', ['$scope', 'DiskAPI', 'Player', function($scope, DiskAPI, Player) {
        $scope.items = DiskAPI.getItems('/');

        var selectedItems = [];

        $scope.toggleDir = function(item) {
            if (item.children == undefined) {
                item.children = DiskAPI.getItems(item.href);
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

            Player.playlist.push(item);
//            document.getElementById('audio').src = 'proxy.php?get=' + encodeURIComponent(item.href);
//            document.getElementById('audio').play();
            //angular.element('audio').attr('src', 'proxy.php?get=' + href);
        }

        $scope.play = function(item) {
            Player.play(item);
            return false;
        }
    }]);