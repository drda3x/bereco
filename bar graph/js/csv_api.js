/**
 * loader and parser to CSV-files
 */

(function (global) {
    "use strict";

    /**
     * function used to get csv file
     * @param {String} url
     * @param {Function} callback
     */
    function loadFile(url, callback) {

        // check params
        if(typeof url !== 'string') {
            throw '"csv_api.js -> loadFile" url has to be an instance of String';
        }
        if(typeof callback !== 'function') {
            throw '"csv_api.js -> loadFile" callback has to be a function';
        }

        // create request
        var xhr = new XMLHttpRequest();

        // send request
        xhr.open('GET', global.location.href.replace(/\w*.\w*$/,'') + url, true);

        xhr.onreadystatechange = function() {
            if(xhr.readyState != 4) {
                return;
            }

            tryParse(xhr.responseText, callback);
        };

        xhr.send();
    }

    /**
     * Parser for loaded file
     * @param {String} data
     * @param {Function} callback
     */
    function tryParse(data, callback) {
        var wholeData = data.split('\n'),
            csvStructure = wholeData[0].split(','),
            csvStructureLen = csvStructure.length,
            result = [];
            csvStructure[csvStructureLen - 1] = csvStructure[csvStructureLen - 1].replace(/\W/,'');

        for (var i= 1, j= wholeData.length; i<j; i++) {
            var obj = {},
                currentData = wholeData[i].split(','),
                len = currentData.length;

            for (var k= 0, n= csvStructureLen; k<n; k++) {

                 obj[csvStructure[k]] = ((k<len) ? currentData[k] : null);
            }

            result.push(obj);
        }

        callback(result);
    }

    // to global
    if(!global.csv) {
        global.csv = {};
    }

    if(!global.csv.getFile) {
        global.csv.getFile = loadFile;
    }

})(this);