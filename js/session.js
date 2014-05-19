angular.module('App')
    .factory('Session', function(TreeNode, Player) {
        console.log('session started');

        var session = {
            root: undefined,
            selectedNode: undefined,
            player: undefined,
            selectedRecords: [],
            playlist: [],

            reset: function() {
                console.log('session reset');

                this.root = new TreeNode({ id: 'root' });
                this.selectedNode = undefined;
                this.selectedRecords.empty();
                this.playlist.empty();
                if (this.player)
                    this.player.stop();
                this.player = new Player(this.playlist, this.selectedRecords);
            }
        };

        session.reset();

        return session;
    });
