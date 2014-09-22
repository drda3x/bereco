/**
 * Created by al on 15.09.14.
 */

(function (g) {

    pictograms = {
        chance_rain: 13,
        chance_of_rain: 13,
        chance_of_snow: 12,
        chance_of_a_thunderstorm: 15,
        clear: 3,
        fog: 2,
        ice_pellets: 6,
        light_snow: 12,
        mostly_cloudy: 2,
        overcast: 2,
        partly_cloudy: 1,
        rain: 4,
        rain_showers: 8,
        scattered_clouds: 1,
        snow: 3,
        snow_showers: 3,
        thunderstorm: 7
    };

    function initWidget() {

        $.getJSON('http://162.243.252.139:8000/weather/-34.612886/-58.448061', function (json) {

            var mapData = (function () {
                var data = [
                        json.conditions.today,
                        json.conditions.tomorrow,
                        json.conditions.tomorrow_plus_1,
                        json.conditions.tomorrow_plus_2
                    ],
                    index = 0;

                return function () {
                    $(this).find('.date').text((function(str) {
                        return str.split('-').reverse().join('/');
                    })(data[index].date));

                    var temp = $(this).find('.temperature'),
                        wind = $(this).find('.footer span:first'),
                        humidty = $(this).find('.footer span:last'),
                        img = $(this).find('.weatherInfoScreen_img');

                    if ($(this).hasClass('current')) {
                        $(this).find('.currentTemperature').html(data[index].temperature_c + '&deg;');
                        $(temp[0]).html('MAX ' + data[index].max + '&deg;');
                        $(temp[1]).html('MIN ' + data[index].min + '&deg;');
                    } else {
                        $(temp).html(data[index].max + '&deg;/' + data[index].min + '&deg;');
                    }

                    pictogram = pictograms[data[index].forecast_text.toLowerCase().replace(/\s/g,'_')];
                    pictogram = ((pictogram < 10) ? '0' + pictogram : pictogram);

                    img.attr('src', './pictogramas/Pictogramas_clima-'+ pictogram +'.png');
                    wind.html(parseFloat(data[index].wind.match(/\d*\.\d*/g)[0]) + 'kml');
                    humidty.html(data[index].humidity_perc + '%');
                    index++;

                }
            })();

            $('.weatherInfoScreen_infoBox_item').each(mapData);
            $('.weatherInfoScreen').css('display','block');
        });

    }

    g.weatherWidget = initWidget

})(this);