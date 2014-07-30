'use strict';

angular.module('services')
    .factory('storage', function(){
        var that = {};

        var st = window.localStorage;

        that.getServices = function() {
            return { drive: {} };
        };
    });