'use strict';

angular.module('services')
    .factory('columnResizer', function($document) {
        var startColWidth, startX, colMinWidth, col, isLeft, contentCol, startContentColWidth, contentColMinWidth;
        var leftWidth, rightWidth;

        var mousedown = function(e) {
            e.preventDefault();

            var th = $(e.target);

            isLeft = th.attr("id") == "resize-bar-left";

            col = isLeft ? $("#left-col") : $("#right-col");
            contentCol = $("#content-col");

            startColWidth = col.outerWidth();
            startContentColWidth = contentCol.outerWidth();
            colMinWidth = parseInt(col.css("min-width"));
            contentColMinWidth = parseInt(contentCol.css("min-width"));

            startX = e.pageX;

            $document.on("mousemove", mousemove);
            $document.on("mouseup", mouseup);
        };

        var mousemove = function (e) {
            var x = e.pageX - startX;

            var contentColWidth = startContentColWidth + (isLeft ? -1 : 1) * x;
            var colWidth = startColWidth + (isLeft ? 1 : -1) * x;

            if (contentColWidth < contentColMinWidth || colWidth < colMinWidth) {
                return;
            }

            if (isLeft) {
                leftWidth = startColWidth + x;
                resizeLeft(contentCol, col, leftWidth);
            }
            else {
                rightWidth = startColWidth - x;
                resizeRight(contentCol, col, rightWidth);
            }
        };

        var mouseup = function () {
            $document.off('mousemove', mousemove);
            $document.off('mouseup', mouseup);
        };

        var resizeLeft = function (contentCol, col, width) {
            col.css('width', width + 'px');
            contentCol.css('margin-left', width + 'px');
        };

        var resizeRight = function (contentCol, col, width) {
            col.css('width', width + 'px');
            col.css('margin-left', "-" + width + 'px');
            contentCol.css('margin-right', width + 'px');
        };


        var restore = function() {
            var contentCol = $("#content-col");
            var leftCol = $("#left-col");
            var rightCol = $("#right-col");

            resizeLeft(contentCol, leftCol, leftWidth);
            resizeRight(contentCol, rightCol, rightWidth);
        };

        return {
            mousedown: mousedown,
            restore: restore
        };
    });
