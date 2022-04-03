"use strict";
exports.__esModule = true;
exports.utils = void 0;
var utils;
(function (utils) {
    function swap(array) {
        var mem;
        mem = array[0];
        array[0] = array[1];
        array[1] = mem;
        return array;
    }
    utils.swap = swap;
})(utils = exports.utils || (exports.utils = {}));
