'use strict';

module.exports = function(grunt) {

    /**
     * Configuring the tasks available for the build process.
     */
    grunt.initConfig({

        /**
         * Starts a local web server.
         */
        connect: {
            dev: {
                options: {
                    port: 9001,
                }
            }
        }
    });

    /**
     * Loads libraries to assist with the build process.
     */
    grunt.loadNpmTasks('grunt-contrib-connect');

    grunt.registerTask('default', ['connect:dev:keepalive']);
};
