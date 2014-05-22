'use strict';

angular.module('Player', ['ui.slider'])
    .factory('Player', function($q) {
        function Ctor() {
            this.audio.volume = 0.5;
//            var self = this;
//            this.audio.addEventListener('ended', function() {
//                self.next(true);
//            });
        }

        Ctor.prototype = {
            audio: new Audio(),
            currentRecord: undefined,
            playRecord: function(record) {
                this.audio.src = record.node.item.url;
                this.audio.play();
                this.currentRecord = record;
            },
            stop: function() {
                this.audio.pause();
                this.audio.src = '';
                this.currentRecord = undefined;
            },
            isPaused: function() {
                return this.audio.paused;
            },
            play: function() {
//                if (this.isPaused() && this.currentRecord)
                    this.audio.play();
            },
            pause: function() {
                this.audio.pause();
            },
            mute: function() {
                this.audio.muted = !this.audio.muted;
            }
        };

        return Ctor;
    });
