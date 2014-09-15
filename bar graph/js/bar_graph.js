/**
 * bar graph main file
 */

(function (global) {
    "use strict";

    var csv = global.csv,
        graph = $('#graph');

    function createTooltip() {
        var tooltip = $('<div id="graph_tooltip"></div>');
        tooltip.css('position', 'absolute');
        tooltip.css('display', 'none');
        $('body').append(tooltip);
        return tooltip;
    }

    function init() {
        csv.getFile('/graph_initial/olas_polares.csv', function(data) {

            var max, min,
                options = {
                    series: {
                        bars: {
                            show: true,
                            barWidth: 0.5,
                            align: "center"
                        },
                        color: '#5786FC'
                    },
                    grid: {
                        hoverable: true
                    },
                    xaxis: {
                        mode: "categories"
                    }
                },
                values = [],
                _data = data;

            for (var i= 0, j= data.length; i<j; i++) {
                var val = data[i];
                values.push([val.Start, parseFloat(val.Min)]);
            }

            var tooltip = createTooltip(),
                mousePosition = {
                    x: null,
                    y: null
                };

            $('#graph').plot([values], options).data('plot');

            $('#graph').bind('plothover', function(event, pos, item) {
                if(item) {

                    if(tooltip.css('display') === 'none') {
                        var datapoint = _data[item.datapoint[0]];

                        tooltip.append(
                                '<div class="graph-tooltip-header">Características de la onda polar</div>' +
                                '<table class="graph-tooltip-content">' +
                                '<tr><td>Temperatura minima:</td><td class="graph-tooltip-value">'+ datapoint.Min +'</td></tr>' +
                                '<tr><td>Inicio:</td><td class="graph-tooltip-value">'+ datapoint.Start +'</td></tr>' +
                                '<tr><td>Fin:</td><td class="graph-tooltip-value">'+ datapoint.End +'</td></tr>' +
                                '<tr><td>Duracion:</td><td class="graph-tooltip-value">'+ datapoint.Duration +'</td></tr>' +
                                '</table>');

                        tooltip.css({display: 'block'});
                    }
                } else {
                    if(tooltip.css('display') !== 'none') {
                        tooltip.css('display', 'none');
                        tooltip.empty();
                    }
                }
            });
            $('#graph').on('mousemove', function(event) {
                if(tooltip.css('display') !== 'none') {
                    tooltip.css({top: event.clientY - 15, left: event.clientX + 15});
                }
            })
        });
    }

    if(!global.barGraph) {
        global.barGraph = {};
    }

    if(!global.barGraph.init) {
        global.barGraph.init = init;
    }

})(this);