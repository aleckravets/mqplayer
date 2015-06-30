'use strict';

angular.module('directives')
    .directive('playlistManager', function(session, Record, Item, clients, playlistService) {
        return {
            restrict: 'E',
            scope: {},
            replace: true,
            link: function(scope, element, attrs) { },
            templateUrl: 'js/directives/playlist-manager/playlist-manager.html',
            controller: function ($scope, $element) {
                var playlist = session.playlist;

                $scope.loading = true;

                $scope.loadPlaylist = function(playlistId) {
                    playlistService.getPlaylistRecords(playlistId)
                        .then(function(data) {
                            playlist.clear();

                            playlist.records = data.map(function(_item) {
                                var item = new Item(clients[_item.service], _item.id, _item.name, 'file', _item.url);
                                return new Record(item);
                            });
                        });
                };

                $scope.savePlaylistAs = function(name) {

                };

                playlistService.getPlaylists()
                    .then(function(playlists) {
                        $scope.playlists = playlists;
                        $scope.loading = false;
                    });
            }
        };
    });
