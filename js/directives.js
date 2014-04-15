'use strict';

angular.module('Directives', ['Services'])
    .directive('delayedModel', function() {
        return {
            scope: {
                model: '=delayedModel'
            },
            link: function(scope, element, attrs) {

                element.val(scope.model);

                scope.$watch('model', function(newVal, oldVal) {
                    if (newVal !== oldVal) {
                        element.val(scope.model);
                    }
                });

                var timeout;
                element.on('keyup paste search', function() {
                    clearTimeout(timeout);
                    timeout = setTimeout(function() {
                        scope.model = element[0].value;
                        element.val(scope.model);
                        scope.$apply();
                    }, attrs.delay || 500);
                });
            }
        };
    });
