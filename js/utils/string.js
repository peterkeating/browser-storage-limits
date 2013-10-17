/*global define */
define([],

/**
 * Helper functions to assist with the string object.
 */
function () {

    function StringUtil() { }

    var p = StringUtil.prototype = {};

    /**
     * Converts a string to an array of bytes.
     * Source: http://stackoverflow.com/a/8639991
     */
    p.stringToBytes = function (str) {
        var ch, st, re = [], j = 0;
        for (var i = 0; i < str.length; i++ ) {
            ch = str.charCodeAt(i);
            if(ch < 127)
            {
                re[j++] = ch & 0xFF;
            }
            else
            {
                st = [];    // clear stack
                do {
                    st.push( ch & 0xFF );  // push byte to stack
                    ch = ch >> 8;          // shift value down by 1 byte
                }
                while ( ch );
                // add stack contents to result
                // done because chars have "wrong" endianness
                st = st.reverse();
                for(var k=0;k<st.length; ++k) {
                    re[j++] = st[k];
                }
            }
        }

        // return an array of bytes
        return re;
    };

    return new StringUtil();
});
