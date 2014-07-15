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

            return tooltip.style("top", y + -140 + "px").style("left", x - 120 + "px")
                .html("<div id='tipContainer' class='small'>" +
                        "<div id='tipLocation'>" +
                            "<b>" + data.properties.Nombre + "</b>" +
                        "</div>" +
                        "<div id='tipKey'>" +
                            "Bicis recibidas: <b>" + formatC(data.properties.emigData.coming) + "</b><br>" +
                            "Bicis entregadas: <b>" + formatC(data.properties.emigData.going) + "</b><br>" +
                            "Diferencia: <b>" + formatC((data.properties.emigData.coming - data.properties.emigData.going)) + "</b>" +
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

        function toolMove2(mx, my, home, end, v1, v2) {
            var diff = v1 - v2,
                x = ((mx < 120) ? 120 : mx),
                y = ((my < 40) ? 40 : my);

            return tooltip2.style("top", my + -140 + "px")
                           .style("left", mx - 120 + "px")
                           .html("<div id='tipContainer' class='large'>" +
                                    "<div id='tipLocation'>" +
                                        "<b>" + home + "/" + end + "</b>" +
                                    "</div>" +
                                    "<div id='tipKey'>Viajes, " + home + " a " + end + ": " +
                                        "<b>" + formatC(v2) + "</b><br>" +
                                        "Viajes, " + end + " a " + home + ": <b>" + formatC(v1) + "</b><br>" +
                                        "Diferencia, " + home + ": <b>" + formatD(v1 - v2) + "</b>" +
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
            var homex = path.centroid(centro)[0];
            var homey = path.centroid(centro)[1];

            g.selectAll(".goingline")
                .attr("stroke-dasharray", 0)
                .remove();

            g.selectAll(".goingline")
                .data(going)
                .enter().append("path")
                .attr("class", "goingline")
                .attr("d", function(d) {
                    var t = selected;
                    var htmiId = getElementId(d.name);
                    var finalval = d.coming - d.going;
                    var theState = d3.select('#' + htmiId);

                    if(!isNaN(finalval)) {
                        var startx = path.centroid(theState[0][0].__data__)[0];
                        var starty = path.centroid(theState[0][0].__data__)[1];

                        if (d.name != centro.properties.Nombre) {
                            return "M" + homex + "," + homey + " Q" + (startx + homex) / 2 + " " + (starty + homey) / 2.5 + " " + startx + " " + starty;
                        }
                    }
                })
                .call(transition)
                .attr("stroke-width", function(d,i) {
                    var finalval = d.coming - d.going,
                        l = lineSize(parseFloat(Math.abs(finalval)));

                    if(l > 15) {
                        return l / 3;
                    } else if (l > 9) {
                        return l / 2;
                    } else {
                        return l * 1.5;
                    }
                })
                .attr("stroke", function(d,i) {
                    var finalval = d.coming - d.going;
                    if(finalval >= 0) {
                        return interfaceColors.bright;
                    } else {
                        return interfaceColors.dark;
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
                    return toolMove2(mx, my, 'CENTRO', d.name, d.coming, d.going);
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

        function VehicleValueStructure(area, type, input, output) {
            this.area = area;
            this.type = type;
            this.in = input;
            this.out = output;
        }

        d3.csv('initial_data/Coming_Going.csv', function (csvData) {
            var data = csvData[0],
                totalInn = 0,
                totalOut = 0,
                strct;

            for(var key in data) {
                var arr = data[key].split(','),
                    area = key.split(' '),
                    type = area[area.length - 1];

                area.length--;
                area = area.join('');

                if(arr.length > 1) {
                    strct = new VehicleValueStructure(area, type, parseInt(arr[0]), parseInt(arr[1]));
                    going.push(strct);
                    goingHash[key] = strct;
                    totalInn += strct.coming;
                    totalOut += strct.going;
                }
            }

            strct = new GoingHashStructure(totalInn, totalOut, 'CENTRO');
            going.push(strct);
            goingHash.CENTRO = strct;

            strct = null;

            d3.json("initial_data/Lat_Long.json", function (data) {
                for(var i= 0, j= data.features.length; i<j; i++) {
                    data.features[i].properties.emigData = goingHash[data.features[i].properties.Nombre];

                    if(data.features[i].properties.Nombre == goingHash.CENTRO.name) {
                        centro = data.features[i];
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
                        var diff = d.properties.emigData.coming - d.properties.emigData.going;
                        if (diff > 0) {
                            return interfaceColors.bright;
                        } else {
                            return interfaceColors.dark;
                        }

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