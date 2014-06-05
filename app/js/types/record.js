'use strict';

angular.module('Types')
     .factory('Record', function() {
        /**
         * Creates a Record instance
         * @param {string} name
         * @param {string} url
         * @constructor
         */
        function Ctor(name, url) {
            this.name = name;
            this.url = url;
            this.selected = false;
        }

        return Ctor;
    });
