Array.prototype.empty = function() {
    this.splice(0, this.length);
};

Array.prototype.pushArray = function(items) {
    Array.prototype.push.apply(this, items);
};

Array.prototype.spliceArray = function(start, deleteCount, insertItems) {
    Array.prototype.splice.apply(this, [start, deleteCount].concat(insertItems));
};

function getParameterByName(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.search);
    return results == null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}

var isFF = navigator.userAgent.toLowerCase().indexOf('firefox') > -1;

// hide bootstrap dropdown menu by mousedown, not on click
$('body').on('mousedown', function(e) {
    if ($(e.target).parents('.dropdown').length === 0) {
        $('.dropdown').removeClass('open');
    }
});