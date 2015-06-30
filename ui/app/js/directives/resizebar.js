'use strict';

angular.module('directives')
    .directive('resizeBar', function($document, session) {
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

            resize(x);

            session.state.sidebarWidth = x;
        };

        var mouseup = function () {
            $document.off('mousemove', mousemove);
            $document.off('mouseup', mouseup);
        };

        var resize = function(x) {
            $("#left").css('width', startWidth + x + 'px');
            $("#right").css('margin-left', startWidth + handleWidth + x + 'px');
        };

        return {
            restrict: 'E',
            scope: { },
            replace: true, // deprecated use transclude: 'element'
            controller: function($scope, $element) {
            },
            link: function(scope, element, attrs) {
                element.on('mousedown', mousedown);

                // restore width
                if (session.state.sidebarWidth) {
                    resize(session.state.sidebarWidth);
                }
            },
            template: '<div id="resize-bar"></div>'
        };
    });
