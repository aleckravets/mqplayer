'use strict';

angular.module('services')
    .factory('session', function(Player, Playlist, Tree, dataService, page) {
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