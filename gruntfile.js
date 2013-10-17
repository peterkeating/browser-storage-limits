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
                    hostname: '*',
                    port: 9001
                }
            }
        },

        /**
         * Analyses JavaScript files using JSHint for errors or potential problems.
         * You can customise the parameters by modifying the .jshintrc file.
         * - http://jshint.com/
         */
        jshint: {
            all: [
                'gruntfile.js',
                'js/**/*.js',
                '!js/vendor/**/*.js'
            ],
            options: {
                jshintrc: '.jshintrc'
            }
        }
    });

    /**
     * Loads libraries to assist with the build process.
     */
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-contrib-jshint');

    grunt.registerTask('default', ['connect:dev:keepalive']);
};
