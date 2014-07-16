/**
 * <<Описание файла>>
 */

(function (global) {
    "use strict";

    var d3 = global.d3;

    window.onload = function () {

        var interfaceColors = {
            bright: '#4BACC6',
            dark: '#C0504D'
        };
        
        var colors = ["#EDF8FB","#41083e"];
        var immdomain = [24431,537148];
        var emmdomain = [20056,566986];

        var circleSize = d3.scale.linear().range([0,25000]).domain([0, 137175]);
        var lineSize = d3.scale.linear().range([2,25]).domain([0, 35000]);
        var fillcolor = d3.scale.linear().range(colors).domain(immdomain);
        var formatC = d3.format(",.0f");
        var formatD = d3.format("+,.0f");

        //initialize html tooltip
        var tooltip = d3.select("#maincontainer")
            .append("div")
            .attr("id", "tt")
            .style("z-index", "10")
            .style("position", "absolute")
            .style("visibility", "hidden");

        var tooltip2 = d3.select("#maincontainer")
            .append("div")
            .attr("id", "tt2")
            .style("z-index", "10")
            .style("position", "absolute")
            .style("visibility", "hidden");

        // tooltip event-handlers
        function toolOver(v, thepath) {
            d3.select(thepath).style({
                "fill-opacity": "0.7",
                "cursor": "pointer"
            });
            return tooltip.style("visibility", "visible");
        };

        function toolOut(m, thepath) {
            d3.select(thepath).style({
                "fill-opacity": "0.5",
                "cursor": ""
            });
            return tooltip.style("visibility", "hidden");
        };

        function toolMove(mx, my, data) {

            var x = ((mx < 120) ? 120 : mx),
                y = ((my < 40) ? 40 : my);

            return tooltip.style("top", y - 90 + "px").style("left", x - 20 + "px")
                .html("<div id='tipContainer' class='small'>" +                                               //data.properties.tooltipValues
                        "<div id='tipLocation'>" +
                            "<b>" + data.properties.Nombre + "</b>" +
                        "</div>" +
                        "<div id='tipKey'>" +
                            "TOTAL: " + Math.round(data.properties.tooltipValue) + " trips" +
                        "</div>" +
                        "<div class='tipClear'></div> </div>"
                );
        };

        function toolOver2(v, thepath) {
            d3.select(thepath).style({
                "opacity": "1",
                "cursor": "pointer"
            });
            return tooltip2.style("visibility", "visible");
        };

        function toolOut2(m, thepath) {
            d3.select(thepath).style({
                "opacity": "0.5",
                "cursor": ""
            });
            return tooltip2.style("visibility", "hidden");
        };

        function toolMove2(mx, my, type, val) {
            var x = ((mx < 120) ? 120 : mx),
                y = ((my < 40) ? 40 : my);

            return tooltip2.style("top", my + -40 + "px")
                           .style("left", mx - 20 + "px")
                           .html("<div id='tipContainer' class='small line'>" +
                                    /*"<div id='tipLocation'>" +
                                        "<b>" + type + "</b>" +
                                    "</div>" +*/
                                    "<div id='tipKey'>" +
                                        "<span>" + type + ": " + Math.round(val) + " trips</span>" +
                                    "</div>" +
                                    "<div class='tipClear'></div> " +
                                 "</div>"
                           );
        };

        // Get id of the circle
        function getElementId(name) {
            return name.replace(/[\s|\W]/gi, '');
        }

        // Circle event handler
        function clicked(selected) {
            var selname = selected.id;

            var centro = d3.select('#TOTAL')[0][0].__data__,
                homex = path.centroid(centro)[0],
                homey = path.centroid(centro)[1];

            g.selectAll(".goingline")
                .attr("stroke-dasharray", 0)
                .remove();

            g.selectAll(".goingline")
                .data(going)
                .enter().append("path")
                .attr("class", "goingline")
                .attr("d", function(d) {
                    var t = selected,
                        htmlId = getElementId(d.area),
                        theState = d3.select('#' + htmlId)[0][0].__data__;

                    var curveCoeffs = {
                        Verde: {x: 2.2, y: 2.5},
                        Pu: {x: 1.7, y: 2.3},
                        Pr: {x: 2.3, y: 2.2}
                    };

                    var startx = path.centroid(theState)[0],
                        starty = path.centroid(theState)[1];

                    if (d.area != centro.properties.Nombre) {
                        return "M" + homex + "," + homey + " Q" + (startx + homex) / curveCoeffs[d.type].x + " " + (starty + homey) / curveCoeffs[d.type].y + " " + startx + " " + starty;
                    }
                })
                .call(transition)
                .attr("stroke-width", 5)
                .attr("stroke", function(d) {
                    switch(d.type) {
                        case 'Verde':
                            return '#FFD700';
                        case 'Pu':
                            return '#458B74';
                        case 'Pr':
                            return '#00688B';
                    }
                })
                .attr("fill", "none")
                .attr("opacity", 0.5)
                .attr("stroke-linecap", "round")
                .on("mouseover", function (d) {
                    return toolOver2(d, this);
                })
                .on("mousemove", function (d,i) {
                    var m = d3.mouse(this),
                        mx = m[0],
                        my = m[1];
                    return toolMove2(mx, my, d.type, d.val);
                })
                .on("mouseout", function (d) {
                    return toolOut2(d, this);
                });
        }

        function transition(path) {
            path.transition()
                .duration(1500)
                .attrTween("stroke-dasharray", tweenDash);
        }

        function tweenDash() {
            var l = this.getTotalLength(),
                i = d3.interpolateString("0," + l, l + "," + l);
            return function(t) { return i(t); };
        }

        d3.select(self.frameElement).style("height", "700px");

        // Map options
        var width = 900,
            height = 880;

        var projection = d3.geo.mercator()
            .scale(60000)
            .center([-58.627, -34.452]);

        var path = d3.geo.path()
            .projection(projection);

        var svg = d3.select("#map")
            .append('svg')
            .attr('width', width)
            .attr('height', height);

        var map = svg.append('g')
            .attr('z-index', 999);

        var g = svg.append("g")
            .attr('z-index', 1000);

        // Main map
        d3.json('initial_data/ba-topo.json', function (json) {
            map.selectAll('path')
                .data(json.features)
                .enter()
                .append('path')
                .attr('d', path)
                .attr('class', 'mainMap')
                .attr('id', function(d) {
                    return getElementId(d.properties.PARTIDO);
                })
                .attr('fill', function(d) {
                    var id = getElementId(d.properties.PARTIDO);
                    colors = {
                        CiudaddeBuenosAires: '#E1A8ED',
                        SANFERNANDO: '#B01D98',
                        VICENTELOPEZ: '#B01D98',
                        SANISIDRO: '#B01D98',
                        TIGRE: '#B01D98'
                    };
                    return ((colors.hasOwnProperty(id) ?  colors[id] : '#C64697'));
                });    // #B01D98
        });

        // Binding data
        var going = [],
            goingHash = {},
            centro;

        function GoingHashStructure(coming, going, name) {
            this.coming = coming;
            this.going = going;
            this.name = name;
        }

        function VehicleValueStructure(area, type, value) {
            this.area = area;
            this.type = type;
            this.val = value;
        }

        d3.csv('initial_data/Coming_Going.csv', function (csvData) {
            var data = csvData[0],
                totalInn = 0,
                totalOut = 0,
                total = 0,
                strct;

            for(var key in data) {
                var val = parseFloat(data[key].replace(',','.')),
                    arr = data[key].split(','),
                    area = key.split(' '),
                    type = area[area.length - 1];

                area.length--;
                area = area.join('');

                if(val) {
                    strct = new VehicleValueStructure(area, type, val);
                    going.push(strct);
                    total += strct.val;
                }
            }


            strct = new VehicleValueStructure('TOTAL', 'TOTAL', total);
            going.push(strct);

            var tt = going;
            strct = null;

            d3.json("initial_data/Lat_Long.json", function (data) {
                for(var i= 0, j= data.features.length; i<j; i++) {
                    data.features[i].properties.tooltipValues = {};
                    for(var k= 0, m= going.length; k<m; k++) {
                        var current = going[k];
                        if(current.area == data.features[i].properties.Nombre) {
                            data.features[i].properties.tooltipValue = current.val;
                        }
                    }
                }

                g.selectAll("circle")
                    .data(data.features)
                    .enter().append("circle")
                    .attr("cx", function (d) {
                        var ctroid;
                        ctroid = path.centroid(d)[0];
                        return ctroid;
                    })
                    .attr("cy", function (d) {
                        var ctroid;
                        ctroid = path.centroid(d)[1];
                        return ctroid;
                    })
                    .attr("r", function (d) {
//                        /*var diff = d.properties.emigData.coming - d.properties.emigData.going,
//                        r = circleSize(Math.sqrt(Math.abs(diff) / Math.PI)) * 3;
//                        return (r < 2) ? r*5 : r;*/
                        return 10;
                    })
                    .attr("class", "circ")
                    .attr("id", function (d) {
                        return getElementId(d.properties.Nombre);
                    })
                    .attr("fill", function (d) {
                        /*var diff = d.properties.emigData.coming - d.properties.emigData.going;
                        if (diff > 0) {
                            return interfaceColors.bright;
                        } else {
                            return interfaceColors.dark;
                        }*/
                        return interfaceColors.bright;
                    })
                    .attr("fill-opacity", "0.5")
                    .attr("stroke", "#fff")
                    .attr("stroke-weight", "2")
                    .on("mouseover", function (d) {
                        return toolOver(d, this);
                    })
                    .on("mousemove", function (d) {
                        var m = d3.mouse(this);
                        var mx = m[0];
                        var my = m[1];
                        return toolMove(mx, my, d);
                    })
                    .on("mouseout", function (d) {
                        return toolOut(d, this);
                    })
                    .on("click", function (d) {
                        clicked(d)
                    });
            });
        });
    }

})(this);