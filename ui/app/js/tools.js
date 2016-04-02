Array.prototype.empty = function() {
    this.splice(0, this.length);
};

Array.prototype.pushArray = function(items) {
    Array.prototype.push.apply(this, items);
};

Array.prototype.spliceArray = function(start, deleteCount, insertItems) {
    Array.prototype.splice.apply(this, [start, deleteCount].concat(insertItems));
};

/**
 * Removes one or multiple items from array
 * @param a
 */
Array.prototype.remove = function(a) {
    if (Array.isArray(a)) {
        var th = this;
        a.forEach(function(item) {
            th.remove(item);
        });
    }
    else {
        var index = this.indexOf(a);

        if (index !== -1) {
            this.splice(index, 1);
        }
    }
};

Array.prototype.add = function(item) {
    if (this.indexOf(item) === -1) {
        this.push(item);
    }
};

Array.prototype.clone = function() {
    return this.slice(0);
};

Array.prototype.shuffle = function() {
    var counter = this.length, temp, index;

    while (counter > 0) {
        index = Math.floor(Math.random() * counter);

        counter--;

        temp = this[counter];
        this[counter] = this[index];
        this[index] = temp;
    }

    return this;
};

Array.prototype.rotate = function(n) {
    this.unshift.apply(this, this.splice(n, this.length));
    return this;
};

function isEmpty(obj) {
    for(var prop in obj) {
        if(obj.hasOwnProperty(prop))
            return false;
    }

    return true;
}

function getParameterByName(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.search);
    return results == null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}

var isFF = navigator.userAgent.toLowerCase().indexOf('firefox') > -1;

//// hide bootstrap dropdown menu on mousedown, not on click
//$(document).on('mousedown', function(e) {
//    if ($(e.target).parents('.dropdown').length === 0) {
//        $('.dropdown').removeClass('open');
//    }
//});
//
//$(document).on('click.bs.dropdown.data-api', '.accounts li', function (e) { e.stopPropagation(); })
//$(document).on('click.bs.dropdown.data-api', '.accounts button', function (e) { $('.accounts').removeClass('open'); })