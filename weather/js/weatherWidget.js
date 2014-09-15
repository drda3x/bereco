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

        $.getJSON('../weather/fixture/test.json', function (json) {

            var mapData = (function () {
                var data = [
                        json.conditions.today,
                        json.conditions.tomorrow,
                        json.conditions.tomorrow_plus_1,
                        json.conditions.tomorrow_plus_2
                    ],
                    index = 0;

                return function () {
                    $(this).find('.date').text(data[index].date.replace(/-/g, '/'));

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
console.log(data[index].forecast_text.toLowerCase().replace(/\s/g,'_'));
                    pictogram = pictograms[data[index].forecast_text.toLowerCase().replace(/\s/g,'_')];
                    pictogram = ((pictogram < 10) ? '0' + pictogram : pictogram);

                    img.attr('src', '../weather/static/pictogramas/Pictogramas_clima-'+ pictogram +'.png');
                    wind.html(parseFloat(data[index].wind.match(/\d*\.\d*/g)[0]));
                    humidty.html(data[index].humidty_perc);
                    index++;

                }
            })();

            console.log(mapData);

            // todo Я что-то забыл, потом проверить все подстановки
            $('.weatherInfoScreen_infoBox_item').each(mapData);
        });

    }

    g.weatherWidget = initWidget

})(this);