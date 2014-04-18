'use strict';

angular.module('Disk', ['Tree', 'Player', 'Services'])
    .factory('Item', ['$q', 'DiskAPI', function($q, DiskAPI) {
        function Item(itemData) {
            angular.extend(this, itemData || { href: '/' });
        }

        Item.prototype = {
            collapsed: true,
            isDir: function() {
                return this.resourceType == 'dir';
            },
            getChildren: function() {
                var item = this;
                return $q.when(this.children || DiskAPI.loadItemsData(this.href).then(function(response) {
                    item.children = response.data.map(function(itemData){
                        return new Item(itemData);
                    });
                    return item.children;
                }));
            },
            getUrl: function() {
                return DiskAPI.getFileUrl(this.href)
            }
        };

        return Item;
    }]);