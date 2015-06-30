'use strict';

angular.module('directives')
    .directive('draggable', function() {
        return {
            link: function(scope, element, attrs) {
                element.attr('draggable', true);

                element[0].addEventListener('dragstart', function(e) {
                    scope.$emit('dragstart');

                    // needed for FF.
                    if (window.isFF) {
                        e.dataTransfer.setData('test', 'wtf');
                    }
                });

                element[0].addEventListener('dragend', function() {
                    scope.$emit('dragend');
                });
            }
        };
    });