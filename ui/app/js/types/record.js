'use strict';

angular.module('types')
     .factory('Record', function() {
        /**
         * Creates a Record instance
         * @param {string} name
         * @param {string} url
         * @constructor
         */
        function Ctor(item, account) {
            this.item = item;
//            this.name = name;
//            this.url = url;
            this.selected = false;
            this.account = account;
        }

        return Ctor;
    });
