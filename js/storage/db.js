define([
],
function () {

        /**
         * Current version of the database structure.
         */
    var DB_VERSION = 1,

        /**
         * Name of the database.
         */
        DB_NAME = 'browser-storage-limit';

    function Db() {
        this.checkSupport();
        this.deleteDatabase();
        this.open();
    }

    var p = Db.prototype = {};

    /**
     * Sets flag to indicate whether indexed DB is supported in the visiting browser.
     */
    p.checkSupport = function () {
        this.supported = window.indexedDB !== undefined;
    };

    /**
     * Deletes the database.
     */
    p.deleteDatabase = function () {
        window.indexedDB.deleteDatabase(DB_NAME);
    };

    /**
     * Starts a transaction for the provided object store.
     */
    p.getTransaction = function (objectStoreName) {
        return this.database.transaction([objectStoreName], 'readwrite');
    };

    /**
     * Opens a connection to the local database and performs any updates that are
     * required.
     */
    p.open = function () {
        if (!this.supported) {
            return;
        }

        var self = this;
        var openRequest = window.indexedDB.open(DB_NAME, DB_VERSION);

        openRequest.onupgradeneeded = function(event) {
            var db = event.target.result;

            /**
             * Performs the initial object store creation.
             */
            if (event.oldVersion < 1) {
                db.createObjectStore('images');
            }
        };

        openRequest.onsuccess = function () {
            self.database = openRequest.result;
            self.loaded = true;

            if (self.onLoaded) {
                self.onLoaded();
            }
        };
    };

    return new Db();
});
