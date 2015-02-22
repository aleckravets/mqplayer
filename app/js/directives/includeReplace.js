'use strict';

angular.module('directives')
    .directive('includeReplace', function () {
        return {
//            require: 'ngInclude',
            restrict: 'A', /* optional */
            link: function (scope, el, attrs) {
                el.replaceWith(el.children());
            }
        };
    });