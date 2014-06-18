'use strict';

angular.module('services')
    .factory('session', function(Player, Playlist, Tree, dataService, page, helper) {
        var that = {
            active: false,
            userInfo: undefined
        };

        function start() {
            that.playlist = new Playlist();
            that.tree = new Tree();
            that.player = new Player();
        }

        function end() {
            that.player.stop();
            that.player = undefined;
            that.tree = undefined;
            that.playlist = undefined;
            page.setTitle('Music Queue');
        }

        /**
         * Parses the "state" query parameter passed by Google Drive on "Open with..." and plays the specified files.
         */
        function checkState() {
            var st = getParameterByName('state');

//        st = "%7B%22ids%22%3A%5B%220B9OzzXRNwUnXVnRxU2kzQTdsUm8%22%2C%220B9OzzXRNwUnXdEpyOVJNUkxwcDg%22%5D%2C%22action%22%3A%22open%22%2C%22userId%22%3A%22103354693083460731603%22%7D";

            if (st) {
                var state = angular.fromJson(decodeURI(st));

//            // debug
//            state = {
//                "ids": [
//                    "0B9OzzXRNwUnXVnRxU2kzQTdsUm8",
//                    "0B9OzzXRNwUnXdEpyOVJNUkxwcDg"
//                ],
//                "action": "open",
//                "userId": "103354693083460731603"
//            };

                if (state.ids && state.ids.length > 0) {
                    that.playlist.set(helper.getRecordsByItemIds(state.ids))
                        .then(function(records) {
                            if (records.length > 0) {
                                that.player.playRecord(records[0]);
                            }
                        })
                        .catch(function(reason) {
                        });
                }
            }
        }

        /**
         * Logs in and starts the session on success.
         * @param {boolean} auto If set to "true" will try to sign in quietly by using cookies.
         * @returns {Promise<session>} A promise of started session.
         */
        that.login = function (auto) {
            return dataService.authorize(auto)
                .then(function () {
                    start();
                    that.active = true;
                    that.userInfo = dataService.userInfo;

                    checkState();
                    return that;
                });
        };

        /**
         * Logs out and stops the session.
         * @returns {Promise} A promised resolved when done.
         */
        that.logout = function () {
            return dataService.signOut()
                .then(function () {
                    end();
                    that.active = false;
                });
        };

        return that;
    });