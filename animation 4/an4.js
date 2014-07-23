/**
 * <<Описание файла>>
 */

(function (global, google, document) {
    "use strict";

    function initMap() {
        var mapOptions = {
                center: new google.maps.LatLng(-34.61106492834361,-58.4498405456543),
                zoom: 12,
                mapTypeId: google.maps.MapTypeId.ROADMAP
            },
            map = new google.maps.Map(document.getElementById('map'), mapOptions)

    }

    if(!global.animationApi) {
        global.animationApi = {}
    }

    global.animationApi.initializeMap = initMap;

})(this, google, document);