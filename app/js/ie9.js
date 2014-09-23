(function() {
    // fix drag and drop missing for elements other than <a></a>
    var draggable;

    $(document).on("mousedown", "[draggable]", function (e) {
        draggable = e.target;
    });

    $(document).on("mouseup", function (e) {
        draggable = undefined;
    });

    $(document).on("mousemove", function (e) {
        if (draggable) {
            draggable.dragDrop();
            draggable = undefined;
        }
    });

    $(document).on("selectstart", "[draggable]", function (e) {
        return false;
    });
}());
