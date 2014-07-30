'use strict';

angular.module('services')
    .factory('clients', function(driveClient){
        var that = {};

        that.load = function(name) {
            // todo: verify name...
            // todo: check if loaded already
            // load library...
            // instantiate client wrapper type... that[name] = new <ClientType>();

            // return promise...
        };
    });