'use strict';

angular.module('app')
    .controller('OpenFromDriveController', function($scope, session, $location, $timeout, helper, clients) {
        $scope.loading = true;

        var ids = _getItemIds();

        if (!ids) {
            _goHome();
            return;
        }

        session.autoLogin()
            .then(function () {
                if (clients.drive.isLoggedIn()) {
                    _enqueue(ids);
                    _goHome();
                }
            })
            .catch(function() {
                $scope.loading = false;
            });

        $scope.login = function() {
            session.login('drive')
                .then(function() {
                    _enqueue(ids);
                    _goHome();
                });
        };

        $scope.cancel = function() {
            _goHome();
        };

        function _goHome() {
            $location.replace(); // don't let them navigate back
            $location.url('/');
        }

        function _enqueue(ids) {
            return session.playlist.set(helper.getRecordsByItemIds(clients.drive, ids))
                .then(function (records) {
                    if (records.length > 0) {
                        session.player.playRecord(records[0]);
                    }
                })
                .catch(function (reason) {
                });
        }

        function _getItemIds() {
            var stateString = getParameterByName('state'),
                state;
//            stateString = "%7B%22ids%22%3A%5B%220B9OzzXRNwUnXVnRxU2kzQTdsUm8%22%2C%220B9OzzXRNwUnXdEpyOVJNUkxwcDg%22%5D%2C%22action%22%3A%22open%22%2C%22userId%22%3A%22103354693083460731603%22%7D";

            if (stateString) {
                try {
                    state = angular.fromJson(decodeURI(stateString));
//                state = {"ids": ["0B9OzzXRNwUnXVnRxU2kzQTdsUm8", "0B9OzzXRNwUnXdEpyOVJNUkxwcDg"], "action": "open", "userId": "103354693083460731603"};
                }
                catch(error) {
                    console.log('Error parsing the state parameter: ' + error);
                    return;
                }

                if (state.ids && state.ids.length > 0) {
                    return state.ids;
                }
            }
        }
    });