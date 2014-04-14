'use strict';

angular.module('Disk', ['Disk.directives', 'Disk.services'])
    .controller('DiskCtrl', ['$scope', '$resource', 'DiskData', function($scope, $resource, DiskData) {
        $scope.items = [];

        DiskData.query({path: '/'}, function (data){
            $scope.items = data;
        });
  }]);

