'use strict';

angular.module('App')
    .factory('Item', ['$q', 'DataService', function($q, DataService) {
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
                if (!this.children)
                    this.loading = true;
                return $q.when(this.children || DataService.loadItemsData(this.href).then(function(response) {
                    item.loading = false;
                    item.children = response.data.map(function(itemData){
                        return new Item(itemData);
                    });
                    return item.children;
                }));
            },
            getUrl: function() {
                return DataService.getFileUrl(this.href);
            }
        };

        return Item;
    }]);