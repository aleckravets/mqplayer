'use strict';

angular.module('app')
    .service('PlaylistService', function(api) {

        var url = '/playlists';

        this.list =  function() {
            return api.get(url);
        };

        this.getRecords = function(playlistId) {
            return api.get(url + '/' + playlistId + '/records');
        };

        this.create = function(name, records) {
            return api.post(url, {
                name: name,
                records: records
            });
        };

        this.update = function(id, name) {
            return api.post(url + '/' + id, {
               name: name
            });
        };

        /**
         * Delete single or multiple playlists
         * @param id - single id or array of ids
         * @returns {*|HttpPromise}
         */
        this.delete = function(id) {
            if (angular.isArray(id)) {
                return api.post(url + '/delete', id);
            }
            else {
                return api.delete(url + '/' + id);
            }
        };

    });
