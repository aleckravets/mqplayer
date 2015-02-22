'use strict';

angular.module('services')
    .factory('columnResizer', function($document, session) {
        var startColWidth, startX, colMinWidth, col, isLeft, contentCol, startContentColWidth, contentColMinWidth;

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

            resize(x);

            session.state.sidebarWidth = x;
        };

        var mouseup = function () {
            $document.off('mousemove', mousemove);
            $document.off('mouseup', mouseup);
        };

        var resize = function(x) {
            if (isLeft) {
                col.css('width', startColWidth + x + 'px');
                contentCol.css('margin-left', startColWidth + x + 'px');
            }
            else {
                col.css('width', startColWidth - x + 'px');
                col.css('margin-left', "-" + (startColWidth - x) + 'px');
                contentCol.css('margin-right', (startColWidth - x) + 'px');
            }
        };

        return {
            mousedown: mousedown,
            restore: restore
        };
    });
