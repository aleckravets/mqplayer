'use strict';

angular.module('API', [])
    .factory('DiskAPI', ['$http', function($http){
            var url = 'proxy.php';

            return {
                loadItemsData: function(path) {
                    return $http.get(url + path);
                },
                getFileUrl: function(path) {
                    return url + '?get=' + encodeURIComponent(path);
                }
            };
        }]);
 
