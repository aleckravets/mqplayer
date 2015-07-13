'use strict';

angular.module('types')
    .factory('PlaylistManager', function(PlaylistService) {
        function PlaylistManager() {
            this.playlists = [];
        }

        PlaylistManager.prototype = {
            loadPlaylists: function() {
                var $this = this;
                return PlaylistService.list()
                    .then(function(playlists) {
                        $this.playlists = playlists;
                        return playlists;
                    });
            }
        };

        return PlaylistManager;
    });