'use strict';

angular.module('Types')
    .factory('Item', function() {
        function Ctor(data) {
            this.id = data.id;
            this.name = data.title;
            this.isDir = data.mimeType == 'application/vnd.google-apps.folder';
            this.url = data.webContentLink;
        }

        return Ctor;
    });
