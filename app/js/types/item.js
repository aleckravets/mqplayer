'use strict';

angular.module('types')
    .factory('Item', function() {
        /**
         * Instantiates an Item
         * @param {string} id unique identifier
         * @param {string} name
         * @param {boolean} isDir
         * @param {string} url absolute url
         * @param {integer} parentid
         * @constructor
         */
        function Ctor(id, name, isDir, url, parentid) {
            this.id = id;
            this.name = name;
            this.isDir = isDir;
            this.url = url;
            this.parentid = parentid;
        }

        return Ctor;
    });
