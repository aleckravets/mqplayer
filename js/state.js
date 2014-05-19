angular.module('App')
    .factory('State', function() {
        return {
            root: undefined,
            selectedNode: undefined,
            selectedRecords: []
        }
    });
