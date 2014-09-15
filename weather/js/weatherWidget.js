/**
 * Created by al on 15.09.14.
 */

(function(g) {

    function initWidget() {

        $.getJSON('../weather/fixture/test.json', function(json) {

           var mapData = (function() {
                var data = [
                        json.conditions.today,
                        json.conditions.tomorrow,
                        json.conditions.tomorrow_plus_1,
                        json.conditions.tomorrow_plus_2
                    ],
                    index = 0;

                return function() {
                    $(this).find('.date').text(data[index].date.replace(/-/g,'/'));

                    var temp = $(this).find('.temperature'),
                        wind = $(this).find('.footer span:first'),
                        humidty = $(this).find('.footer span:last');

                    if($(this).hasClass('current')) {
                        temp[0].text('MAX ' + data[index].max + '&deg;');
                        temp[1].text('MIN ' + data[index].min + '&deg;');
                    } else {
                        temp.text(data[index].max + '&deg;/' + data[index].min + '&deg;');
                    }

                    wind.text(parseFloat(data[index].wind.match(/[0-9]/g)));
                    humidty.text(data[index].humidty_perc);

                }
            })();
            // todo Я что-то забыл, потом проверить все подстановки
            $('.weatherInfoScreen_infoBox_item').each(mapData);
        });

    }

    g.weatherWidget = initWidget

})(this);