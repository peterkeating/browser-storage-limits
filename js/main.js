require([
    'jquery',
    'storage/db',
    'storage/images',
    'web/images'
],

function ($, Db, ImagesDb, ImagesWeb) {

        /**
         * Milliseconds between each save of an image to the local database.
         */
    var DELAY = 250,

        /**
         * Button to kick start experiment.
         */
        $btnStart = $('.js-btn-start'),

        /**
         * Button to stop the loop of saving images to the local database.
         */
        $btnStop = $('.js-btn-stop'),

        /**
         * Counter component used to show the current size that has been saved to
         * the database.
         */
        $counter = $('.js-counter'),

        /**
         * DOM element that stores the current storage size.
         */
        $counterCount = $('.js-counter .js-count'),

        /**
         * DOM element containing message that browser doesn't support client side
         * storage.
         */
        $notSupported = $('.js-not-supported'),

        /**
         * Blob to be saved into local storage.
         */
        imageBlob,

        /**
         * Interval used to continually save an image to the database.
         */
        timeout,

        /**
         * Count of how many times the image has been saved to the local database.
         */
        saveCount = 0;

    /**
     * Saves image to the local database.
     */
    var saveImage = function () {
        timeout = window.setTimeout(function () {
            ImagesDb.save(++saveCount, imageBlob, {
                success: function () {
                    updateCount();
                    saveImage();
                }
            });
        }, DELAY);
    };

    /**
     * Starts the experiment.
     */
    var start = function () {
        $btnStart.addClass('hidden');
        $btnStop.removeClass('hidden');
        $counter.removeClass('hidden');

        saveImage();
    };

    /**
     * Stops the loop of saving to the local database.
     */
    var stop = function () {
        window.clearTimeout(timeout);

        $btnStop.addClass('hidden');
        $btnStart.removeClass('hidden');
    };

    /**
     * Updates the counter.
     */
    var updateCount = function () {
        /**
         * Calculate the total bytes saved based on how many times to the image
         * has been saved, and then convert the value to megabytes while rounding
         * to 2 decimal places.
         */

        var count = parseFloat((saveCount * imageBlob.size) / 1048576).toFixed(2);
        $counterCount.html(count);
    };

    $(document).ready(function () {
        $btnStart.on('click', start);
        $btnStop.on('click', stop);

        if (!Db.supported) {
            $btnStart.addClass('hidden');
            $notSupported.removeClass('hidden');
        }
    });

    /**
     * Makes AJAX request to get blob of image to be saved to the database.
     */
    ImagesWeb.get({
        success: function (image) {
            imageBlob = image;
        }
    });

});
