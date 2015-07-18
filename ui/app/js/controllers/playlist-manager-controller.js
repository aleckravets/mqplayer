'use strict';

angular.module('app')
    .controller('PlaylistManagerController', function($scope, PlaylistService, session, clients, Item, Record, $q) {
        var playlist = session.playlist;
        var player = session.player;
        var playlistManager = $scope.playlistManager = session.playlistManager;

        $scope.select = function(savedPlaylist) {
            savedPlaylist.selected = !savedPlaylist.selected;
        };

        $scope.selected = function() {
            return playlistManager.playlists
                .filter(function(playlist) {
                   return playlist.selected;
                });
        };

        $scope.play = function(savedPlaylist) {
            $scope.loading = true;

            PlaylistService.getRecords(savedPlaylist.id)
                .then(function(data) {
                    playlist.clear();

                    playlist.records = data.map(function(_item) {
                        var item = new Item(clients[_item.account.service], _item.id, _item.name, 'file', _item.url);
                        return new Record(item, _item.account.id);
                    });

                    var recordToPlay;
                    var playlistClients = [];

                    playlist.records.forEach(function(record) {
                        var client = record.item.client;

                        if (playlistClients.indexOf(client) === -1) {
                            playlistClients.push(client);
                        }

                        if (!recordToPlay && client.isLoggedIn()) {
                            recordToPlay = record;
                        }
                    });

                    if (playlist.records.length) {
                        if (recordToPlay) {
                            player.playRecord(recordToPlay)
                                .catch(function (error) {
                                    $scope.error(error);
                                });
                        }
                        else if (playlistClients.length) {
                            var error;

                            if (playlistClients.length > 1) {
                                error = 'To play records from this playlist you have to be logged in to the following services: '
                                    + playlistClients.map(function(client) { return client.title; }).join(', ');
                            }
                            else {
                                error = 'You have to be logged in to ' + playlistClients[0].title + ' to play records from this playlist.'
                            }

                            $scope.error(error);
                        }
                    }
                })
                .finally(function() {
                    $scope.loading = false;
                });
        };

        $scope.enqueue = function(savedPlaylist) {
            $scope.loading = true;

            PlaylistService.getRecords(savedPlaylist.id)
                .then(function(data) {
                    var records = data.map(function (_item) {
                        var item = new Item(clients[_item.account.service], _item.id, _item.name, 'file', _item.url);
                        return new Record(item, _item.account.id);
                    });
                    playlist.enqueue($q.when(records));
                })
                .finally(function() {
                    $scope.loading = false;
                });
        };

        $scope.remove = function(savedPlaylist) {
            var playlists;

            if (savedPlaylist) {
                playlists = [savedPlaylist];
            }
            else {
                playlists = playlistManager.playlists
                    .filter(function (playlist) {
                        return playlist.selected;
                    });
            }

            if (playlists.length) {
                $scope.loading = true;

                var ids = playlists.map(function(playlist) {
                    return playlist.id;
                });

                PlaylistService.delete(ids)
                    .then(function() {
                        playlistManager.playlists.remove(playlists);
                    })
                    .finally(function() {
                        $scope.loading = false;
                    });
            }
        };

        function loadPlaylists() {
            $scope.loading = true;

            playlistManager.loadPlaylists()
                .finally(function() {
                    $scope.loading = false;
                });
        }

        loadPlaylists();

    });