'use strict';

angular.module('app')
    .controller('HomeController', function($scope, session, columnResizer) {
        if (session.loggedIn() === undefined) {
            session.autoLogin();
        }

        $scope.resizeBarMousedown = columnResizer.mousedown;
        $scope.restoreBarWidths = function() {
            columnResizer.restore();
        };
    });