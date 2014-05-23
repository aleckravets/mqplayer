'use strict';

angular.module('App')
    .factory('session', function($rootScope, Player, Playlist, Tree, DataService) {
        return {
            active: false,
            userInfo: undefined,
            login: function(auto) {
                var self = this;
                return DataService.authorize(auto)
                    .then(function() {
                        self.start();
                        self.active = true;
                        self.userInfo = DataService.userInfo;
                        console.log('session started');
                    });
            },
            logout: function() {
                var self = this;
                return DataService.signOut()
                    .then(function() {
                        self.end();
                        self.active = false;
                    });
            },
            start: function() {
                this.playlist = new Playlist();
                this.tree = new Tree();
                this.player = new Player();

                this.player.audio.addEventListener('ended', function() {
                    $rootScope.$broadcast('playerEnded');
                });
            },
            end: function() {
                this.player.stop();
                this.player = undefined;
                this.tree = undefined;
                this.playlist = undefined;

                console.log('session ended');
            }
        };
    });
