'use strict';

angular.module('app')
    .factory('page', function() {
        var title = 'Music Queue';
        return {
            title: function() { return title; },
            setTitle: function(newTitle) { title = newTitle; }
        };
    });