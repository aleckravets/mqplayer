'use strict';

angular.module('App')
    .factory('Playlist', function() {

        function Ctor() {
        }

        Ctor.prototype = {
            records: [],
            selectedRecords: [],
            loading: false
        };

        return Ctor;
    });