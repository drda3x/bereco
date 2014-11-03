(function(global){
    function init() {
        $.ajax({
            url: 'http://162.243.252.139:8000/weather/forecast/ranking/-34.599722/-58.381944'
        }).done(function(data) {
            drawGraph(JSON.parse(data).ranking);
        });
    }

    function drawGraph(data){
        var series = [],
            placeholder = $('#clima_graph');

        data.sort(function(a,b) {
            return b.ioa - a.ioa;
        });

        for (var i= 0, j= data.length; i<j; i++) {
            series.push([data[i].forecaster, data[i].ioa]);
        }

        $.plot('#clima_graph', [series],{
            grid: {
                borderWidth: 0,
                color: '#ffffff'
            },
            series: {
                bars: {
                    show: true,
                    barWidth: 0.5,
                    align: 'center',
                    fillColor: '#ECA627',
                    lineWidth: 0
                }
            },
            xaxis: {
                mode: "categories",
                tickLength: 0
            }
        });
    }

    global.climaGraph = {}
    global.climaGraph.init = init

})(this);