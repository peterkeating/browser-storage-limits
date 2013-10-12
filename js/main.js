require([
    'jquery'
],

function ($) {

    var $btnStart = $('.js-btn-start');

    /**
     * Starts the experiment.
     */
    var start = function () {

    };

    $(document).ready(function () {
        // clicking the start button will begin the experiment.
        $btnStart.on('click', start);
    });

});
