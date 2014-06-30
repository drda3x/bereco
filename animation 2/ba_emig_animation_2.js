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
                            "<b>" + data.id + "</b>" +
                        "</div>" +
                        "<div id='tipKey'>" +
                            "Bicis recibidas: <b>" + formatC(data.properties.total_imm) + "</b><br>" +
                            "Bicis entregadas: <b>" + formatC(data.properties.total_emm) + "</b><br>" +
                            "Diferencia: <b>" + formatC((data.properties.total_imm - data.properties.total_emm)) + "</b>" +
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
            var homex = path.centroid(selected)[0];
            var homey = path.centroid(selected)[1];

            g.selectAll(".goingline")
                .attr("stroke-dasharray", 0)
                .remove();


            g.selectAll(".goingline")
                .data(going)
                .enter().append("path")
                .attr("class", "goingline")

                .attr("d", function(d,i) {
                    var nameKey = Object.keys(d)[0];
                    var htmiId = getElementId(d[nameKey]);
                    var finalval = coming[i][selname] - going[i][selname];
                    var theState = d3.select('#' + htmiId);

                    if(!isNaN(finalval) && selname != d[nameKey]) {
                        var startx = path.centroid(theState[0][0].__data__)[0];
                        var starty = path.centroid(theState[0][0].__data__)[1];

                        if(finalval > 0) {
                            return "M" + startx + "," + starty + " Q" + (startx + homex)/2 + " " + (starty + homey)/1.5 +" " + homex+" "   + homey;
                        } else {
                            return "M" + homex + "," + homey + " Q" + (startx + homex)/2 + " " + (starty + homey)/2.5 +" " + startx+" "   + starty;
                        }
                    }
                })
                .call(transition)
                .attr("stroke-width", function(d,i) {
                    var finalval = coming[i][selname] - going[i][selname],
                        l = lineSize(parseFloat(Math.abs(finalval)));

                    if(l > 15) {
                        return l / 3;
                    } else if (l > 9) {
                        return l / 2;
                    } else {
                        return l * 1.5;
                    }

                    //return 3;
                })
                .attr("stroke", function(d,i) {
                    var finalval = coming[i][selname] - going[i][selname];
                    if(finalval >= 0) {
                        //return interfaceColors.bright;
                        return null;
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
                        name_key = Object.keys(d)[0],
                        mx = m[0],
                        my = m[1];
                    console.log(name_key);
                    return toolMove2(mx, my, selname, d[name_key], coming[i][selname], going[i][selname]);
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
            .scale(25000)
            .center([-58.647, -34.272]);

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
                .attr('class', 'mainMap');
        });

        // Binding data
        var coming, going;
        d3.csv('initial_data/coming.csv', function (data) {
            coming = data;
        });

        d3.csv('initial_data/going.csv', function (data) {
            going = data;

            d3.csv("initial_data/Lat_Long.csv", function (data) {
                var name_key = Object.keys(coming[0])[0],
                    w1, h1;

                var lastid = 0;

                function getId() {
                    return ++lastid;
                }

                function Structure(name, clong, clat) {
                    this.type = 'Feature';
                    this.id = name;
                    this.numId = 'crkl_' + getId();
                    this.properties = {
                        //  name: name
                    };
                    this.geometry = {
                        type: 'Point',
                        coordinates: [parseFloat(clong), parseFloat(clat)]
                    }
                }

                function getComingOrGoingData(feature, data, sumName) {
                    var i = 0,
                        j = data.length,
                        matched = false;

                    for (; i < j; i++) {
                        if (data[i][name_key] == feature.id) {
                            matched = true;
                            break;
                        }
                    }

                    if (matched) {
                        var d = data[i],
                            sum = 0;
                        for (var prop in d) {
                            var value = parseInt(d[prop]);
                            if (value) {
                                feature.properties[prop] = value;
                            sum += value;
                        }
                        }
                        feature.properties[sumName] = sum;
                    }
                }

                var points = [], pxls, obj, x, y;

                for (var i = 0, j = data.length; i < j; i++) {

                    obj = new Structure(data[i].Partido, data[i].Long, data[i].Lat);

                    getComingOrGoingData(obj, coming, 'total_imm');
                    getComingOrGoingData(obj, going, 'total_emm');

                    points.push(obj);
                    pxls = path.centroid(obj);
                }

                g.selectAll("circle")
                    .data(points)
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
                        var diff = d.properties.total_imm - d.properties.total_emm,
                            r = circleSize(Math.sqrt(Math.abs(diff) / Math.PI));
                            if(r<10) {
                                return r*3;
                            }
                        return r/2;
                    })
                    .attr("class", "circ")
                    .attr("id", function (d) {
                        return getElementId(d.id);
                    })
                    .attr("fill", function (d) {
                        var diff = d.properties.total_imm - d.properties.total_emm;
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