/*global define */
define([],

/**
 * Module is responsible for compressing string values that are to be stored in
 * client storage. The source of this technique of compressing / decompressing
 * base64 encoded strings can be found from the links below.
 *
 * http://labs.ft.com/2012/06/text-re-encoding-for-optimising-storage-capacity-in-the-browser/
 * http://jsfiddle.net/morganestes/yjxtB/
 */
function () {

    function StorageOptimization() { }

    var p = StorageOptimization.prototype = {};

    /**
     * Compresses the provided string to reduce the amount of space it takes up
     * in storage.
     */
    p.compress = function (s) {
        var i, l, out = '';

        if (s.length % 2 !== 0) {
            s += ' ';
        }

        for (i = 0, l = s.length; i < l; i += 2) {
            out += String.fromCharCode((s.charCodeAt(i) * 256) + s.charCodeAt(i + 1));
        }

        return String.fromCharCode(9731) + out;
    };

    /**
     * Converts a compressed string into its original form.
     */
    p.decompress = function (s) {
        var i, l, n, m, out = '';

        /**
         * checks to see if marker is used to determine whether the provided string
         * has been created by the `compress` method.
         */
        if (s.charCodeAt(0) !== 9731) {
            return s;
        }

        for (i = 1, l = s.length; i < l; i++) {
            n = s.charCodeAt(i);
            m = Math.floor(n / 256);
            out += String.fromCharCode(m, n % 256);
        }

        return out;
    };

    return new StorageOptimization();
});
