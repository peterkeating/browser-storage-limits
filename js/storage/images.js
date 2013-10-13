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
    p.save = function (id, image) {
        var transaction = Db.getTransaction(OBJECT_STORE),
            store = transaction.objectStore(OBJECT_STORE);

        store.put(image, id);
    };

    return new Images();
});
