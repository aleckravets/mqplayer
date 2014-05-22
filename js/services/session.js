'use strict';

angular.module('App')
    .factory('session', function(Player, Playlist, Tree, DataService) {
        return {
            active: false,
            login: function(auto) {
                var self = this;
                return DataService.authorize(auto)
                    .then(function() {
                        self.start();
                        self.active = true;
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
            },
            end: function() {
                this.player.stop();
                this.player = undefined;
                this.tree = undefined;
                this.playlist = undefined;

                console.log('session ended');
            }
        };
    })
    // shortcuts to session objects
    .factory('player', function(session) {
        return session.player;
    })
    .factory('tree', function(session) {
        return session.tree;
    })
    .factory('playlist', function(session) {
        return session.playlist;
    });
