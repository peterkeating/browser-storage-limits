define([
    'indexedDBPolyfill'
],
function (indexedDBPolyfill) {

        /**
         * Current version of the database structure.
         */
    var DB_VERSION = 1,

        /**
         * Name of the database.
         */
        DB_NAME = 'browser-storage-limit',

        /**
         * Name of object store used to check the browser support for saving a
         * blob to local storage.
         */
        BLOB_SUPPORT_OBJECT_STORE = 'blobsupport';

    function Db() {
        this.checkSupport();
        this.deleteDatabase();
        this.open();
    }

    var p = Db.prototype = {};

    /**
     * Checks to see if the browser supports saving a blob into the local database
     * by trying to do exactly that.
     */
    p.checkBlobSupport = function () {
        try {
            var store = this.getTransaction(BLOB_SUPPORT_OBJECT_STORE).objectStore(BLOB_SUPPORT_OBJECT_STORE);
            store.put(new Blob(), 'key');
            store['delete']('key');
            this.blobSupported = true;
        } catch (err) {
            this.blobSupported = false;
        }
    };

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
        if (this.supported) {
            window.indexedDB.deleteDatabase(DB_NAME);
        }
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
                db.createObjectStore(BLOB_SUPPORT_OBJECT_STORE);
            }
        };

        openRequest.onsuccess = function () {
            self.database = openRequest.result;
            self.checkBlobSupport();
        };
    };

    return new Db();
});
