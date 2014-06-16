'use strict';

angular.module('services')
    .factory('session', function(Player, Playlist, Tree, dataService, page) {
        var self = {
            active: false,
            userInfo: undefined,
            login: function (auto) {
                var self = this;

                return dataService.authorize(auto)
                    .then(function () {
                        start();
                        self.active = true;
                        self.userInfo = dataService.userInfo;
                    });
            },
            logout: function () {
                var self = this;
                return dataService.signOut()
                    .then(function () {
                        end();
                        self.active = false;
                    });
            }
        };

        // private
        function start() {
            self.playlist = new Playlist();
            self.tree = new Tree();
            self.player = new Player();
        }

        function end() {
            self.player.stop();
            self.player = undefined;
            self.tree = undefined;
            self.playlist = undefined;
            page.setTitle('Music Queue');
        }

        return self;
    });
