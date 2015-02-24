'use strict';

angular.module('playlistManager')
    .factory('PlaylistManager', function(UserPlaylist, api) {
        function PlaylistManager() {}

        PlaylistManager.prototype = {
            getPlaylists: function() {
                return api.get('/playlists');
            },
            getPlaylistRecords: function(playlistId) {
                return api.get('/playlists/' + playlistId + '/records');
            }
        };

        return PlaylistManager;
    });
