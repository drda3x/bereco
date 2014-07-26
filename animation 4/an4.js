/**
 * <<Описание файла>>
 */

(function (global, google, document) {
    'use strict';

    function getPopupHtml(content) {
        var bodyStr = '';

        for(var i= 0, j= content.body.length; i<j; i++) {
            bodyStr += '<div>'+ content.body[i].name +': '+ content.body[i].value +'</div>';
        }

        return '<div id="popup"><div>'+ content.header +'</div>'+ bodyStr +'</div>';
    }

    function getPopupContent(feature) {
        var type = popupTypes[feature.getProperty('tipo')],
            contentStr = '';

        for(var i= 0, j=type.length; i<j; i++) {
            contentStr += '<div>'+ type[i] +': '+ feature.getProperty(type[i]) +'</div>'
        }

        return contentStr;
    }

    var popup = new google.maps.InfoWindow({
        content: 'test'
        }),
        popupTypes = {
            persona: ['riesgoGeografico','edad', 'salud', 'movilidad','riesgoPropio','riesgoTotal'],
            casa: ['riesgoGeografico', 'plantaBaja','riesgoPropio','riesgoTotal'],
            auto: ['riesgoGeografico', 'bajoTierra','riesgoPropio','riesgoTotal']
        };

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

        map.data.addListener('click', function(event) {
            var feature = event.feature;
            popup.setPosition(feature.getGeometry().get());
            popup.setContent(getPopupContent(feature));
            popup.open(map);
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