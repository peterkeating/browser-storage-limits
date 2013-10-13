require([
    'jquery',
    'storage/images',
    'web/images'
],

function ($, ImagesDb, ImagesWeb) {

        /**
         * Milliseconds between each save of an image to the local database.
         */
    var STEP = 250,

        /**
         * Button to kick start experiment.
         */
        $btnStart = $('.js-btn-start'),

        /**
         * Button to stop the loop of saving images to the local database.
         */
        $btnStop = $('.js-btn-stop'),

        /**
         * Blob to be saved into local storage.
         */
        imageBlob,

        /**
         * Interval used to continually save an image to the database.
         */
        interval,

        /**
         * Count of how many times the image has been saved to the local database.
         */
        saveCount = 0;

    /**
     * Saves image to the local database.
     */
    var saveImage = function () {
        ImagesDb.save(++saveCount, imageBlob);
    };

    /**
     * Starts the experiment.
     */
    var start = function () {
        interval = window.setInterval(saveImage, STEP);

        $btnStart.addClass('hidden');
        $btnStop.removeClass('hidden');
    };

    /**
     * Stops the loop of saving to the local database.
     */
    var stop = function () {
        window.clearInterval(interval);

        $btnStop.addClass('hidden');
        $btnStart.removeClass('hidden');
    };

    $(document).ready(function () {
        $btnStart.on('click', start);
        $btnStop.on('click', stop);
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
