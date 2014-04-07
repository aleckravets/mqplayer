'use strict';

/* Directives */

angular.module('Disk.directives', [])
    .directive("tree", function(RecursionHelper) {
        return {
            restrict: "E",
            scope: {family: '='},
            template:
                '<p>{{ family.displayName }}</p>'+
                    '<ul>' +
                    '<li ng-repeat="child in family.children">' +
                    '<tree family="child"></tree>' +
                    '</li>' +
                    '</ul>',
            compile: function(element) {
                return RecursionHelper.compile(element);
            }
        };
    })
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
