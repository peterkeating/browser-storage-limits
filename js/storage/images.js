/*global define */
define([
    'storage/db',
    'storage/storageoptimization',
    'utils/string'
],

function (Db, StorageOptimization, StringUtil) {

    /**
     * Name of the object store in the local database.
     */
    var OBJECT_STORE = 'images';

    function Images() { }

    var p = Images.prototype = {};

    /**
     * Below is an example of how to retrieve an image from local storage.
     */
    p.get = function (id, options) {
        var transaction = Db.getTransaction(OBJECT_STORE),
        store = transaction.objectStore(OBJECT_STORE);

        var fixBinary = function (bin) {
            var length = bin.length,
                buf = new ArrayBuffer(length),
                arr = new Uint8Array(buf),
                i = 0;

            for (i; i < length; i++) {
                arr[i] = bin.charCodeAt(i);
            }

            return buf;
        };

        store.get(id).onsuccess = function (event) {
            var data, blob;

            if (Db.blobSupported && !window.usingIndexedDBPolyfill) {
                blob = event.target.result;
            } else {
                data = fixBinary(atob(StorageOptimization.decompress(event.target.result))),
                blob = new Blob([data], {type: 'image/png'});
            }

            if (options.success) {
                options.success(blob);
            }
        };
    };

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

            store.put(objectToSave, id).onsuccess = function () {
                if (options.success) {
                    options.success((Db.blobSupported && !window.usingIndexedDBPolyfill) ? objectToSave.size : StringUtil.stringToBytes(objectToSave).length);
                }
            };
        };

        /**
         * If the local database supports saving the blob straight to local storage
         * then we do that, otherwise a conversion to base 64 needs to happen first.
         */
        if (Db.blobSupported && !window.usingIndexedDBPolyfill) {
            put(image);
        } else {
            var reader = new FileReader();
            reader.onloadend = function() { put(StorageOptimization.compress(btoa(this.result))); };
            reader.readAsBinaryString(image);
        }
    };

    return new Images();
});
