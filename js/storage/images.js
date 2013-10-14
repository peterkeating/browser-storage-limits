define([
    'storage/db'
],

function (Db) {

    /**
     * URL to image to be loaded.
     */
    var OBJECT_STORE = 'images';

    function Images() { }

    var p = Images.prototype = {};

    /**
     * Saves the provided image to the database.
     */
    p.save = function (id, image, options) {
        /**
         * Function that handles saving the image to local storage.
         */
        var put = function (objectToSave) {
            var transaction = Db.getTransaction(OBJECT_STORE),
            store = transaction.objectStore(OBJECT_STORE);

            store.put(objectToSave, id).onsuccess = function (event) {
                if (options.success) {
                    options.success();
                }
            };
        }

        /**
         * If the local database supports saving the blob straight to local storage
         * then we do that, otherwise a conversion to base 64 needs to happen first.
         */
        if (Db.blobSupported) {
            put(image);
        } else {
            var reader = new FileReader();
            reader.onloadend = function() { put(btoa(this.result)); };
            reader.readAsBinaryString(image);
        }
    };

    return new Images();
});
