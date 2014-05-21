'use strict';

angular.module('App')
    .factory('Session', function(Player, Playlist, Tree) {
        return {
            start: function() {
                this.playlist = new Playlist();
                this.tree = new Tree();
                this.player = new Player(this.playlist);

//                this.root = new TreeNode({ id: 'root' });
//                this.selectedNode = undefined;
//                this.selectedRecords.empty();
//                this.playlist.empty();
//                if (this.player)
//                    this.player.stop();
//                this.player = new Player(this.playlist, this.selectedRecords);
                console.log('session started');
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
    .factory('player', function(Session) {
        return Session.player;
    })
    .factory('tree', function(Session) {
        return Session.tree;
    })
    .factory('playlist', function(Session) {
        return Session.playlist;
    });
