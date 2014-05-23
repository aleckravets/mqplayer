'use strict';

angular.module('Player', ['ui.slider'])
    .factory('Player', function($q) {
        function Ctor() {
            this.audio = new Audio();
            this.audio.volume = 0.5;
this.state = 'stopped';

            this.currentRecord = undefined; // Record

//            var self = this;
//            this.audio.addEventListener('ended', function() {
//                self.next(true);
//            });
        }

        Ctor.prototype = {
            playRecord: function(record) {
                var deferred = $q.defer(),
                    self = this;

                this.state = 'buffering';

                this.audio.src = record.node.item.url;
                self.currentRecord = record;

                this.audio.addEventListener('loadeddata', function() {
                    self.audio.play();
                    self.state = 'playing';
                    deferred.resolve();
                });

                return deferred.promise;
            },
            stop: function() {
                this.audio.pause();
                this.audio.src = '';
                this.currentRecord = undefined;
                this.state = 'stopped';
            },
            isPaused: function() {
                return this.audio.paused;
            },
            play: function() {
                    this.audio.play();
                this.state = 'playing';
            },
            pause: function() {
                this.audio.pause();
                this.state = 'paused';
            },
            mute: function() {
                this.audio.muted = !this.audio.muted;
            }
        };

        return Ctor;
    });
