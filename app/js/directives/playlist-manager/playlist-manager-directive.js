'use strict';

angular.module('directives')
    .directive('playlistManager', function(session, Record, Item, clients) {
        return {
            restrict: 'E',
            scope: {},
            replace: true,
            link: function(scope, element, attrs) { },
            templateUrl: 'js/directives/playlist-manager/playlist-manager.html',
            controller: function ($scope, $element) {
                var playlistManager = session.playlistManager,
                    playlist = session.playlist;

                $scope.loading = true;

                $scope.loadPlaylist = function(playlistId) {
                    playlistManager.getPlaylistRecords(playlistId)
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

                playlistManager.getPlaylists()
                    .then(function(playlists) {
                        $scope.playlists = playlists;
                        $scope.loading = false;
                    });
            }
        };
    });
