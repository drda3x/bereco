/**
 * Created by al on 15.09.14.
 */

(function (g) {

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
                        humidty = $(this).find('.footer span:last');

                    if ($(this).hasClass('current')) {
                        $(this).find('.currentTemperature').html(data[index].temperature_c + '&deg;');
                        $(temp[0]).html('MAX ' + data[index].max + '&deg;');
                        $(temp[1]).html('MIN ' + data[index].min + '&deg;');
                    } else {
                        $(temp).html(data[index].max + '&deg;/' + data[index].min + '&deg;');
                    }

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