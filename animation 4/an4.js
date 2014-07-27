/**
 * <<Описание файла>>
 */

(function (global, google, document) {
    'use strict';

    function Feature() {
        this.data = null;
    }

    Feature.prototype.getPopupContent = function() {
        var mainProp = this.data.getProperty('tipo'),
            type = popupTypes[mainProp],
            contentStr = '';

        for(var i= 0, j=type.length; i<j; i++) {
            contentStr += '<div>'+ type[i] +': '+ this.getScaledParam('wrd', type[i]) +'</div>'
        }

        return '<div id="popup"><div> Riesgo '+ this.getScaledParam('wrd', 'riesgoTotal') +'</div>'+ contentStr +'</div>';
    };

    Feature.prototype.getScaledParam = function(type, param) {
        var params = {
                height: {
                    img: 'icon-red',
                    wrd: 'alto'
                },
                p_middle: {
                    img: 'icon-orange',
                    wrd: 'p_middle'
                },
                m_middle: {
                    img: 'icon-yellow',
                    wrd: 'm_middle'
                },
                lower: {
                    img: 'icon-white',
                    wrd: 'none'
                }
            },
            prop = this.data.getProperty(param);

        if(prop == 0 || prop == null) {
            return params.lower[type];
        } else if(prop < 5 ) {
            return params.m_middle[type];
        } else if(prop < 8) {
            return params.p_middle[type];
        } else {
            return params.height[type];
        }
    };

    Feature.prototype.getLatLng = function() {
        return this.data.getGeometry().get();
    };

    var f = new Feature(),
        popup = new google.maps.InfoWindow({
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
            f.data = feature;
            return {
                icon: getUrl(f.getScaledParam('img', 'riesgoTotal')) +'.png'
            }
        });

        map.data.addListener('click', function(event) {
            f.data = event.feature;
            popup.setPosition(f.getLatLng());
            popup.setContent(f.getPopupContent());
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