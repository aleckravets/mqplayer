'use strict';

angular.module('app')
    .factory('page', function() {
        var title = 'MQ Player';
        return {
            title: function() { return title; },
            setTitle: function(newTitle) { title = newTitle || 'MQ Player'; }
        };
    });