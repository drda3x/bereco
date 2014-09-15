/**
 * <<Описание файла>>
 */

(function (global, google, document, navigator) {
    'use strict';

    function getJson(callback, context) {
        var xhr = new XMLHttpRequest(),
            file_pth = 'initial_data/maximas.json';

        xhr.open('GET', global.location.href.replace(/\/[A-Za-z0-9%]*\.\w*$/,'/') + file_pth, true);
        xhr.onreadystatechange = function() {
            if(xhr.readyState != 4) {
                return;
            }

            callback.apply(context, [null, xhr.responseText]);
        };

        xhr.send();
    }

    // Function for getting initialize map
    function initMap() {

        function tryParse(err, str) {

            if(err) {
                throw err;
            }

            try {
                var json = JSON.parse(str);

                if(!json.features || !json.features instanceof Array) {
                    throw 'Expected feature field in json and it has to be an array';
                }

                createLines(json);

            } catch(e) {
                console.log(e);
            }

        }

        function createLines(data) {
            if(!map) {
                return;
            }

            var temperature_values = [];

            for(var i= 0, j= data.features.length; i<j; i++) {
                var feature = data.features[i],
                    val = parseInt(feature.properties.temperature);

                if(val) {
                    temperature_values.push(val);
                }
            }

            temperature_values = temperature_values
                .sort(function (a, b) {
                    if (a > b)
                        return 1;
                    else if (a < b)
                        return -1;
                    else
                        return 0;
                });

            var tempr_max = temperature_values[temperature_values.length-1],
                tempr_min = temperature_values[0],
                colors = getColors(tempr_max, tempr_min),
                colors_len = colors.length,
                div = getDelta(tempr_max, tempr_min);

            createColorsLegend(colors.reverse(), tempr_max, tempr_min);

            map.data.addGeoJson(data);

            map.data.setStyle(function(feature){
                var t = feature.getProperty('temperature'),
                    color;

                for(i= 0, j= colors.length; i<j; i++) {
                    if(colors[i].min <= t && t <= colors[i].max) {
                        color = colors[i].color;
                        break;
                    }
                }

                return {
                    strokeColor: color,
                    fillColor: color
                }
            });
        };

        var mapOptions = {
                center: new google.maps.LatLng(-34.66806492834361,-58.4598405456543),
                zoom: 12,
                mapTypeId: google.maps.MapTypeId.ROADMAP
            },
            map = new google.maps.Map(document.getElementById('map'), mapOptions);

        getJson(tryParse, map);
        getUserLocation(map);
    }

    function getColors(max, min) {
        var r = 255,
            g = 0,
            b = 0,
            color_delta = getDelta(min, max, 'color'),
            delta = getDelta(min, max, 'degrees'),
            current = 'red',
            colors = [],
            answer = [];
        
        for(var i= getDelta(min, max); i>0; i--) {
            if(current == 'red') {
                if (g + color_delta < 255) {
                    g += color_delta;
                } else {
                    current = 'green';
                    g = 255;
                }
            } else if(current == 'green')  {
                if(r - color_delta > 0) {
                    r -= color_delta;
                } else {
                    r = 0;
                    if(b + color_delta > 255) {
                        current = 'blue';
                        b = 255;
                    } else {
                        b += color_delta;
                    }
                }
            } else {
                if(g - color_delta > 0) {
                    g -= color_delta;
                } else {
                    g = 0;
                    if(r + color_delta < 255) {
                        r += color_delta;
                    } else {
                        current = 'red';
                        r = 255;
                    }
                }
            }
            colors.push('#' + ((r < 16) ? 0 + r.toString(16) : r.toString(16)) + ((g < 16) ? 0 + g.toString(16) : g.toString(16)) + ((b < 16) ? 0 + b.toString(16) : b.toString(16)));
        }

        colors = colors.reverse();

        for(var i= colors.length - 1, j = max; i>= 0; i--) {
            var o = {};
            if(i == colors.length - 1) {
                o.min = j - delta;
                o.max = j;
            } else if(i == 0) {
                if(j-1 <= min) {
                    o.min = j - delta;
                    o.max = j-1;
                } else {
                    o.min = min;
                    o.max = j-1;
                }
            } else {
                o.min = j - delta;
                o.max = j-1;
            }
            o.color = colors[i];
            answer.push(o);
            j-=delta;
        }
        return answer;
    }

    function getDelta(min, max, param) {

        var delta = Math.abs(max - min),
            param = ((param == undefined) ? 'count' : param),
            les_10 = {
                color: 150,
                degrees: 2,
                count: Math.round(delta/2)
            },
            les_45 = {
                color: 75,
                degrees: 3,
                count: Math.round(delta/3)
            },
            more_45 = {
                color: 35,
                degrees: 5,
                count: Math.round(delta/5)
            };

        if(delta <= 10 ) {
            return les_10[param];
        } else if(delta <= 45) {
            return les_45[param];
        } else {
            return more_45[param];
        }
    }

    function createColorsLegend(colors, max, min) {
        var map = document.getElementById('map_container'),
            legend = document.createElement('ul'),
            delta = Math.round(Math.abs(max - min) / getDelta(min, max));
        legend.className = 'map_ul';
        for(var i= colors.length - 1, j = max; i>= 0; i--) {
            var li = legend.appendChild(document.createElement('li')),
                colored_span = li.appendChild(document.createElement('span')),
                label = li.appendChild(document.createElement('span'));
            li.className = 'map_li';

            colored_span.style.backgroundColor = colors[i].color;
            label.textContent = colors[i].max + '..' + colors[i].min;
            colored_span.className = 'legend_colored';
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

})(this, google, document, navigator);