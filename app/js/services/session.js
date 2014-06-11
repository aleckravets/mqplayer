'use strict';

angular.module('services')
    .factory('session', function(Player, Playlist, Tree, dataService, page) {
        return {
            active: false,
            userInfo: undefined,
            login: function(auto) {
                var self = this;

                return dataService.authorize(auto)
                    .then(function() {
                        self.start();
                        self.active = true;
                        self.userInfo = dataService.userInfo;
                    });
            },
            logout: function() {
                var self = this;
                return dataService.signOut()
                    .then(function() {
                        self.end();
                        self.active = false;
                    });
            },
            start: function() {
                this.playlist = new Playlist();
                this.tree = new Tree();
                this.player = new Player();
            },
            end: function() {
                this.player.stop();
                this.player = undefined;
                this.tree = undefined;
                this.playlist = undefined;
                page.setTitle('Music Queue');
            }
        };
    });
