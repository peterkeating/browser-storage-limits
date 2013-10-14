require.config({

    deps: [ 'main' ],

    paths: {
        jquery: 'vendor/jquery-1.10.2',
        indexedDBPolyfill: 'vendor/indexedDB.polyfill'
    },

    shim: {
        indexedDBPolyfill: {
            exports: 'indexedDBPolyfill'
        }
    }
});
