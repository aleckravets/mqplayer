'use strict';

angular.module('app')
    .controller('PlaylistManagerController', function($scope, appData, $rootScope, helper, session) {
        var playlists;

        playlists = $scope.playlists = appData.playlists;

        $scope.loadPlaylist = function(name) {
            helper.restorePlaylist(name, session.playlist);
            $scope.close();
        };

        $scope.mousedown = function(e) {
            e.stopPropagation();
        };

        $scope.remove = function(name) {
            delete appData.playlists[name];
            appData.save();
        };

        $scope.saveDisabled = function() {
            return session.playlist.records.length === 0;
        };

        $scope.keydown = function(e) {
            switch (e.keyCode) {
                case 13: // enter
                    $scope.save();
                    break;
                case 27: // esc
                    return;
            }

            e.stopPropagation();
        };

        $scope.save = function() {
            var name = $scope.saveName;

            if (!name) {
                return false;
            }

            helper.savePlaylist(name, session.playlist);

            $scope.saveName = '';

            return true;
        };

        $scope.isEmpty = function() {
            return isEmpty(playlists);
        };

        $scope.close = function() {
            $scope.closeMenuWidget();
        };
    });