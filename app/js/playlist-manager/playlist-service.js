'use strict';

angular.module('playlistManager')
    .factory('playlistService', function(UserPlaylist, api) {

        return {
            getPlaylists: function() {
                return api.get('/playlists');
            },
            getPlaylistRecords: function(playlistId) {
                return api.get('/playlists/' + playlistId + '/records');
            },
            addPlaylist: function(name, records) {
                return api.post('/playlists', {
                    name: name,
                    records: records
                });
            }
        };

    });
