'use strict';

angular.module('Directives')
    .directive('resizeBar', function($document) {
        var startWidth, handleWidth, startX, min;

        var mousedown = function(e) {
            e.preventDefault();

            startWidth = $("#left").outerWidth();
            handleWidth = $("#resize-bar").outerWidth();
            min = parseInt($("#left").css('min-width'));

            startX = e.pageX;

            $document.on('mousemove', mousemove);
            $document.on('mouseup', mouseup);
        };

        var mousemove = function (e) {
            var x = e.pageX - startX;

            if (startWidth + x < min)
                return;

            $("#left").css('width', startWidth + x + 'px');
            $("#right").css('margin-left', startWidth + handleWidth + x + 'px');
        };

        var mouseup = function () {
            $document.off('mousemove', mousemove);
            $document.off('mouseup', mouseup);
        };

        return {
            restrict: 'E',
            scope: { },
            replace: true, // deprecated use transclude: 'element'
            controller: function($scope, $element) {
            },
            link: function(scope, element, attrs) {
                element.on('mousedown', mousedown);
            },
            template: '<div id="resize-bar"></div>'
        };
    });
