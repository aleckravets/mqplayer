'use strict';

describe('Playlist', function() {
    var playlist, $q, Record, records1, records2, $rootScope;

    beforeEach(function() {
        module('types');
        inject(function(Playlist, _$q_, _Record_, _$rootScope_) {
            playlist = new Playlist();
            $q = _$q_;
            Record = _Record_;
            $rootScope = _$rootScope_;

            records1 = [
                new Record('rec1', 'url1'),
                new Record('rec2', 'url2'),
                new Record('rec3', 'url3')
            ];

            records2 = [
                new Record('rec4', 'url4'),
                new Record('rec5', 'url5')
            ];
        });
    });

    it("enqueue()", function() {
        playlist.enqueue($q.when(records1))
            .then(function() {
                playlist.enqueue($q.when(records2));
            });

        $rootScope.$apply();
        expect(playlist.records.length).toBe(records1.length + records2.length);
        expect(playlist.records[records1.length]).toBe(records2[0]);
    });

    it("enqueue() at a specified position", function() {
        playlist.enqueue($q.when(records1))
            .then(function() {
                playlist.enqueue($q.when(records2), records1[1]);
            });

        $rootScope.$apply();
        expect(playlist.records.length).toBe(records1.length + records2.length);
        expect(playlist.records[1]).toBe(records2[0]);
    });

    it("set()", function() {
        playlist.enqueue($q.when(records1))
            .then(function() {
                playlist.set($q.when(records2));
            });

        $rootScope.$apply();
        expect(playlist.records.length).toBe(records2.length);
    });
});
