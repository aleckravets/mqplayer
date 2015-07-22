'use strict';

angular.module('types')
    .factory('Player', function($rootScope, $q, page, clients) {
        function Ctor() {
            this.audio = new Audio();
            this.volumeStep = 0.05;
            this.audio.volume = 0.5;
            this.state = 'stopped';
            this.currentTime = 0;

            this.currentRecord = undefined; // Record

            var self = this;

            this.audio.addEventListener('ended', function() {
                $rootScope.$broadcast('player.trackended');
            });

            this.audio.addEventListener('loadedmetadata', function() {
                if (self.loadedmetadata) {
                    self.loadedmetadata();
                }
            });

            // emit timeupdate event once a second
            // todo: replace with setInterval?

            // FF does not seek properly on variable bitrate files
            // https://bugzilla.mozilla.org/show_bug.cgi?id=994561
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

                this.stop();

                if (record.item.client && record.item.client.isLoggedIn()) {
                    this.state = 'buffering';

                    $rootScope.$broadcast('player.timeupdate', 0);

                    this.audio.pause();
                    this.audio.src = ''; // todo: set to undefined for IE

                    this.currentRecord = record;

                    record.item.getUrl()
                        .then(function (url) {
                            self.loadedmetadata = function () {
                                self.audio.play();
                                self.state = 'playing';
                                deferred.resolve();
                            };

                            self.audio.src = url;

                            page.setTitle(record.item.name);
                        })
                        .catch(function (error) {
                            console.log('Failed to get file url: ' + error);
                            self.stop();
                        });
                }
                else {
                    deferred.reject('You have to be logged in to ' + clients[record.account.service].title +
                    ' as ' + record.account.email + ' to play this record (' + record.item.name + ').');
                }

                return deferred.promise;
            },
            stop: function() {
                this.audio.pause();
                this.audio.src = '';
                this.currentRecord = undefined;
                this.state = 'stopped';

                page.setTitle();
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
