'use strict';

angular.module('types')
    .factory('Player', function($rootScope, $q, page) {
        function Ctor() {
            this.audio = new Audio();
            this.volumeStep = 0.05;
            this.audio.volume = 0.5;
            this.state = 'stopped';
            this.currentTime = 0;

            this.currentRecord = undefined; // Record

            this.audio.addEventListener('ended', function() {
                $rootScope.$broadcast('player.trackended');
            });

            var self = this;

            // emit timeupdate event once a second
            // todo: replace with setInterval?
            this.audio.addEventListener('timeupdate', function(e) {
                $rootScope.$broadcast('player.timeupdate', self.audio.currentTime);
//                if (self.currentTime && Math.abs(self.audio.currentTime - self.currentTime) <= 1)
//                    return;
//
//                self.currentTime = self.audio.currentTime;
//                $rootScope.$broadcast('player.timeupdate', self.currentTime);
            });
        }

        Ctor.prototype = {
            setTime: function(time) {
                this.audio.currentTime = time;
            },
            playRecord: function(record) {
                var deferred = $q.defer(),
                    self = this;

                this.state = 'buffering';

                $rootScope.$broadcast('player.timeupdate', 0);

                record.item.getUrl().then(function(url) {
                    this.audio.src = url;
                    self.currentRecord = record;

                    this.audio.addEventListener('loadedmetadata', function() {
                        self.audio.play();
                        self.state = 'playing';
                        deferred.resolve();
                    });
                });

                page.setTitle(record.item.name);

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
            },
            volumeUp: function() {
                if (this.audio.volume + this.volumeStep <= 1)
                    this.audio.volume += this.volumeStep;
            },
            volumeDown: function() {
                if (this.audio.volume - this.volumeStep >= 0)
                    this.audio.volume -= this.volumeStep;
            }
        };

        return Ctor;
    });
