angular.module('App')
    .factory('State', function() {
        return {
            selectedNode: undefined,
            selectedRecords: []
        }
    });
