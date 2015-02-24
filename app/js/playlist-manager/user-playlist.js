'use strict';

angular.module('playlistManager')
    .factory('UserPlaylist', function() {
        function UserPlaylist(id, name, url, recordsNumber) {
            this.id = id;
            this.name = name;
            this.url = url;
            this.recordsNumber = recordsNumber;
        }

        return UserPlaylist;
    });
