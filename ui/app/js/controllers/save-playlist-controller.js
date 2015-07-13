'use strict';

angular.module('app')
    .controller('SavePlaylistController', function($scope, $modalInstance, session, PlaylistService, playlist) {
        $scope.title = playlist ? 'Edit playlist' : 'Save playlist';

        if (playlist) {
            $scope.name = playlist.name;
        }

        $scope.ok = function() {
            $scope.loading = true;

            var promise = playlist ? update(playlist, $scope.name) : create($scope.name);

            return promise
                .then(function() {
                    $modalInstance.close();
                })
                .finally(function() {
                    $scope.loading = false;
                });
        };

        function update(playlist, name) {
            return PlaylistService.update(playlist.id, name)
                .then(function() {
                    playlist.name = name;
                });
        }

        function create(name) {
            var entities = session.playlist.records.map(function (record) {
                return {
                    service: record.item.client.name,
                    id: record.item.id,
                    name: record.item.name,
                    //type: record.item.type,
                    url: record.item.getUrl(true)
                };
            });

            return PlaylistService.create(name, entities)
                .then(function(newPlaylist) {
                    session.playlistManager.playlists.add(newPlaylist);
                });
        }

        $scope.cancel = function() {
            $modalInstance.dismiss('cancel');
        };

        $scope.saveKeydown = function($event) {
            if ($event.keyCode == 27) {
                return;
            }

            if ($event.keyCode == 13) { // enter
                $scope.ok();
            }
            $event.stopPropagation();
        };
    });