/**
 * <<Описание файла>>
 */

(function (global, google, document, InfoBox) {
    'use strict';

    function Feature() {
        this.data = null;
    }

    Feature.prototype.getPopupContent = function() {
        var self = this,
            mainProp = self.data.getProperty('tipo'),
            type = popupTypes[mainProp],
            contentStr = '<table id="popupContent" cellpadding="0" cellspacing="0">';

        for(var i= 0, j=type.length; i<j; i++) {
            contentStr += '<tr><td>'+ popupTypeInfo[type[i]] +'</td><td class="values">'+ (function(data) {
                if (data == 'edad') {
                    return self.data.getProperty(data);
                } else {
                    return self.getScaledParam('wrd', data);
                }
            })(type[i])  +'</td></tr>'
        }

        contentStr += '</table>';

        return '<div id="popup"><div class="header"> Riesgo '+ this.getScaledParam('wrd', 'riesgoTotal') +'</div>'+ contentStr + '</div>' +
               '<div id="popupArrow"></div>' ;
    };

    Feature.prototype.getScaledParam = function(type, param) {
        var params = {
                height: {
                    img: 'icon-red',
                    wrd: 'alto'
                },
                p_middle: {
                    img: 'icon-orange',
                    wrd: 'medio alto'
                },
                m_middle: {
                    img: 'icon-yellow',
                    wrd: 'mediano'
                },
                lower: {
                    img: 'icon-white',
                    wrd: 'bajo'
                }
            },
            prop = this.data.getProperty(param);

        if(prop == 0) {
            return params.lower[type];
        } else if(prop < 5 ) {
            return params.m_middle[type];
        } else if(prop < 8) {
            return params.p_middle[type];
        } else if(prop > 8){
            return params.height[type];
        } else {
            return null;
        }
    };

    Feature.prototype.getLatLng = function() {
        return this.data.getGeometry().get();
    };

    var f = new Feature(),
        popup = new InfoBox(),
        popupTypes = {
            persona: ['riesgoGeografico', 'edad', 'salud', 'movilidad', 'riesgoPropio', 'riesgoTotal'],
            casa: ['riesgoGeografico', 'plantaBaja', 'riesgoPropio', 'riesgoTotal'],
            auto: ['riesgoGeografico', 'bajoTierra', 'riesgoPropio', 'riesgoTotal']
        },
        popupTypeInfo = {
            riesgoGeografico: 'Riesgo geografico',
            edad: 'Edad',
            salud: 'Salud',
            movilidad: 'Movilidad',
            riesgoPropio: 'Riesgo propio',
            riesgoTotal: 'Riesgo total',
            plantaBaja: 'Planta baja',
            bajoTierra: 'Bajo tierra'
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
            popup.setOptions({
                //pixelOffset: new google.maps.Size(-105, -240)
                pixelOffset: (function(f){
                    var n = f.getProperty('tipo');
                    if(n == 'persona') {
                        return new google.maps.Size(-105, -240);
                    } else {
                        return new google.maps.Size(-105, -183);
                    }
                })(f.data)
            });
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

})(this, google, document, InfoBox);