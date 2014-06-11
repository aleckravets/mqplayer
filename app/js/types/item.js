'use strict';

angular.module('types')
    .factory('Item', function() {
        /**
         * Instantiates an Item
         * @param {string} id unique identifier
         * @param {string} name
         * @param {boolean} isDir
         * @param {string} url absolute url
         * @constructor
         */
        function Ctor(id, name, isDir, url) {
            this.id = id;
            this.name = name;
            this.isDir = isDir;
            this.url = url;
        }

        return Ctor;
    });
