/**
 * <<Описание файла>>
 */

(function (global, google, document) {
    "use strict";

    // Function for getting initialize map
    function initMap() {
        var mapOptions = {
                center: new google.maps.LatLng(-34.61106492834361,-58.4498405456543),
                zoom: 12,
                mapTypeId: google.maps.MapTypeId.ROADMAP
            },
            map = new google.maps.Map(document.getElementById('map'), mapOptions);

        map.data.loadGeoJson(getUrl('casos.json'));
        map.data.setStyle(function(feature){
            var prop = feature.getProperty('riesgoTotal'),
                icon;

            if(prop == 0) {
                icon = 'icon-white'
            } else if(prop < 5 ) {
                icon = 'icon-yellow'
            } else if(prop < 8) {
                icon = 'icon-orange'
            } else {
                icon = 'icon-red'
            }

            return {
                icon: getUrl(icon) +'.png'
            }
        });
    }

    function getUrl(fileName) {
        return global.location.pathname.replace(/\w*.\w*$/,'') + fileName
    }

    if(!global.animationApi) {
        global.animationApi = {}
    }

    global.animationApi.initializeMap = initMap;

})(this, google, document);