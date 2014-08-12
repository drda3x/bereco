/**
 * <<Описание файла>>
 */

(function (global, google, document, InfoBox, navigator) {
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
                if (data == 'edad' || data == 'tipo') {
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

    Feature.prototype.getDynamicParam = function(type, param) {

    };

    Feature.prototype.getLatLng = function() {
        return this.data.getGeometry().get();
    };

    var f = new Feature(),
        popup = new InfoBox(),
        popupTypes = {
            persona: ['tipo', 'riesgoGeografico', 'edad', 'salud', 'movilidad', 'riesgoPropio', 'riesgoTotal'],
            casa: ['tipo','riesgoGeografico', 'plantaBaja', 'riesgoPropio', 'riesgoTotal'],
            auto: ['tipo','riesgoGeografico', 'bajoTierra', 'riesgoPropio', 'riesgoTotal']
        },
        popupTypeInfo = {
            tipo: 'Tipo',
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

        map.data.loadGeoJson(getUrl('initial_data/maximas.json'));

        var temperature_borders = {
            max: 0,
            min: 1000000
        };
        map.data.forEach(function(feature) {
            var t = feature.getProperty('temperature');
            console.log('aaaa');
            temperature_borders.max = ((t > temperature_borders.max) ? t : temperature_borders.max);
            temperature_borders.min = ((t < temperature_borders.min) ? t : temperature_borders.min);

        });

        console.log(map.data.hasOwnProperty('forEach'));
        console.log(map.data.hasOwnProperty('loadGeoJson'));
/*        var line_colors = getColors(temperature_borders.min, temperature_borders.max),
            lc_len = line_colors.length,
            div = 3;

        createColorsLegend(line_colors);

        map.data.setStyle(function(feature){
            var t = feature.getProperty('temperature'),
                color_position = Math.round(Math.abs(t/div));

            color_position = ((color_position >= lc_len) ? lc_len-1 : color_position);

            return {
                strokeColor: line_colors[color_position]
            }
        });

        getUserLocation(map);*/
    }

    function getColors(min, max) {
        var r = 255,
            g = 0,
            b = 0,
            delta = 150,
            current = 'red',
            colors = [];

        for(var i= Math.round(Math.abs(max - min) / 5); i>0; i--) {
            if(current == 'red') {
                if (g + delta < 255) {
                    g += delta;
                } else {
                    current = 'green';
                    g = 255;
                }
            } else if(current == 'green')  {
                if(r - delta > 0) {
                    r -= delta;
                } else {
                    r = 0;
                    if(b + delta > 255) {
                        current = 'blue';
                        b = 255;
                    } else {
                        b += delta;
                    }
                }
            } else {
                if(g - delta > 0) {
                    g -= delta;
                } else {
                    g = 0;
                    if(r + delta < 255) {
                        r += delta;
                    } else {
                        current = 'red'
                        r = 255;
                    }
                }
            }
            colors.push('#' + ((r < 16) ? 0 + r.toString(16) : r.toString(16)) + ((g < 16) ? 0 + g.toString(16) : g.toString(16)) + ((b < 16) ? 0 + b.toString(16) : b.toString(16)));
        }
        return colors.reverse();
    }

    // todo вообще-то тут все должно быть параметризировано))

    function createColorsLegend(colors) {
        var map = document.getElementById('map_container'),
            legend = document.createElement('ul');

        for(var i= colors.length - 1, j = 14; i>= 0; i--) {
            var li = legend.appendChild(document.createElement('li')),
                colored_span = li.appendChild(document.createElement('span')),
                label = li.appendChild(document.createElement('span'));

            colored_span.style.backgroundColor = colors[i];
            colored_span.className = 'legend_colored';

            label.textContent = ((j > 0) ? '+' : '') + j + ' .. ' + (((j -= 3) > 0) ? '+' : '') + j;
            label.className = 'legend_label';
        }

        map.appendChild(legend);
    }

    function getUserLocation(map) {
        navigator.geolocation.getCurrentPosition(function(position) {
            var lat = position.coords.latitude,
                lon = position.coords.longitude,
                marker = new google.maps.Marker({
                    map: map,
                    position: new google.maps.LatLng(lat, lon)
                })
        });
    }

    function getUrl(fileName) {
        return global.location.pathname.replace(/\w*.\w*$/,'') + fileName
    }

    if(!global.animationApi) {
        global.animationApi = {}
    }

    global.animationApi.initializeMap = initMap;

})(this, google, document, InfoBox, navigator);