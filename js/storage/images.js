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
        var transaction = Db.getTransaction(OBJECT_STORE),
            store = transaction.objectStore(OBJECT_STORE);

        console.log(id);

        store.put(image, id).onsuccess = function (event) {
            if (options.success) {
                options.success();
            }
        };
    };

    return new Images();
});
