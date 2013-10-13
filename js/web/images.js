define([
    'jquery'
],

function ($) {

    /**
     * URL to image to be loaded.
     */
    var URL = 'images/asset.png';

    function Images() { }

    var p = Images.prototype = {};

    /**
     * Makes an AJAX request to grab blob of image that will be saved repeatedly
     * to the local database.
     */
    p.get = function (options) {
        var xhr = new XMLHttpRequest();

        xhr.open('GET', URL, true);
        xhr.responseType = 'blob';
        xhr.addEventListener('load', function () {
            if (xhr.status !== 200) {
                return;
            }

            if (options.success) {
                options.success(xhr.response);
            }
        }, true);

        xhr.send();
    };

    return new Images();
});
