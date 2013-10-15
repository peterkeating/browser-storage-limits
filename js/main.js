require([
    'jquery',
    'storage/db',
    'storage/images',
    'web/images',
    'polyfills/raf'
],

function ($, Db, ImagesDb, ImagesWeb) {

        /**
         * Milliseconds between each save of an image to the local database.
         */
    var DELAY = 100,

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
         * DOM element for displaying additional notes to the user.
         */
        $notes = $('.js-notes'),
        $notesList = $notes.find('ul'),


        /**
         * Blob to be saved into local storage.
         */
        imageBlob,

        /**
         * Flag containing whether the experiment is currently running.
         */
        running = false,

        /**
         * Interval used to continually save an image to the database.
         */
        timeout,

        /**
         * Count of how many times the image has been saved to the local database.
         */
        saveCount = 0;

    /**
     * Adds a note to the list of notes and reveals the notes.
     */
    var addNote = function (id, note) {
        if ($notesList.find('.' + id).length > 0) {
            return;
        }

        window.requestAnimationFrame(function () {
            $notesList.append('<li class="' + id + '">' + note + '</li>');
            $notes.removeClass('hidden');
        });
    };

    /**
     * Saves image to the local database.
     */
    var saveImage = function () {
        if (!running) {
            return;
        }

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
        window.requestAnimationFrame(function () {
            $btnStart.addClass('hidden');
            $btnStop.removeClass('hidden');
            $counter.removeClass('hidden');
            $btnStart.html('Continue Experiment');
        });

        if (!Db.blobSupported) {
            addNote('blob-support', 'Browser doesn\'t support storing blobs, reverted to converting blob to base64 using <a href="https://developer.mozilla.org/en-US/docs/Web/API/FileReader">FileReader</a> & <a href="https://developer.mozilla.org/en-US/docs/Web/API/Window.btoa">btoa</a>.');
        }

        running = true;

        saveImage();
    };

    /**
     * Stops the loop of saving to the local database.
     */
    var stop = function () {
        running = false;

        window.clearTimeout(timeout);

        window.requestAnimationFrame(function () {
            $btnStop.addClass('hidden');
            $btnStart.removeClass('hidden');
        });
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
        window.requestAnimationFrame(function () {  $counterCount.html(count); });
    };

    $(document).ready(function () {
        $btnStart.on('click', start);
        $btnStop.on('click', stop);

        if (!Db.supported || !window.FileReader) {
            window.requestAnimationFrame(function () {
                $btnStart.addClass('hidden');
                $notSupported.removeClass('hidden');
            });

            if (!window.FileReader) {
                addNote('file-reader-support', 'FileReader is not supported in this browser.');
            }

            return;
        }

        if (window.usingIndexedDBPolyfill) {
            addNote('indexeddb-polyfill', 'Browser doesn\'t support indexedDB, falls back to using the <a href="https://github.com/facebook/IndexedDB-polyfill/">Facebook indexedDB polyfill</a> that mimics the indexedDB API using the Web SQL database API.');
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
