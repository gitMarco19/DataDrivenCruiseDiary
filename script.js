var someTime = new Array();
var stages;
var proj;
var vento = "computedWind";
var lineAnimation = true;
var playAnimation = false;
var intervalID;
var j = 0;
var tempo = 2000;

var svgD = d3.select("#distance");
var svgS = d3.select("#ship_speed");
var svgT = d3.select("#temperatura");
var svgTw = d3.select("#water");
var svgH = d3.select("#humidity");
var svgP = d3.select("#pressure");
var svgW = d3.select("#wind_speed");
var svgUV = d3.select("#uv_index");

var svg = d3.select(".focus");
var margin = {top: 15, right: 15, bottom: 15, left: 35};
var width = +svg.attr("width") - margin.left - margin.right;
var height = +svg.attr("height") - margin.top - margin.bottom;

var tooltip = d3.select("body")
				.append("div")	
				.attr("class", "tooltip")				
				.style("opacity", 0);

var infoBox = d3.select("#box")
				.style("display", "none");

var focus;

var x = d3.scaleTime()
			.range([margin.left, width]);
var x2 = d3.scaleTime()
			.range([margin.left, width]);

var y = d3.scaleLinear().range([height - margin.top, margin.top]);
var lineDistance = d3.line()
		.x(d => x(d.Data))
		.y(d => y(d.distance));

var y1 = d3.scaleLinear().range([height - margin.top, margin.top]);
var lineShipSpeed = d3.line()
		.x(d => x(d.Data))
		.y(d => y1(d.shipSpeed));
	
var y2 = d3.scaleLinear().range([height - margin.top, margin.top]);
var lineAirTemp = d3.line()
		.x(d => x(d.Data))
		.y(d => y2(d.temperature));

var y3 = d3.scaleLinear().range([height - margin.top, margin.top]);
var lineWaterTemp = d3.line()
		.x(d => x(d.Data))
		.y(d => y3(d.waterTemperature));

var y4 = d3.scaleLinear().range([height - margin.top, margin.top]);
var lineHumidity = d3.line()
		.x(d => x(d.Data))
		.y(d => y4(d.humidity));

var y5 = d3.scaleLinear().range([height - margin.top, margin.top]);
var linePressure = d3.line()
		.x(d => x(d.Data))
		.y(d => y5(d.pressure));

var y6 = d3.scaleLinear().range([height - margin.top, margin.top]);
var lineAppWindSpeed = d3.line()
		.x(d => x(d.Data))
		.y(d => y6(d.appWindSpeed));
var lineComputedWindSpeed = d3.line()
		.x(d => x(d.Data))
		.y(d => y6(d.computedWindSpeed));

var y7 = d3.scaleLinear().range([height - margin.top, margin.top]);
var lineIndexUV = d3.line()
		.x(d => x(d.Data))
		.y(d => y7(d.UVIndex));

function line_chart(svg) {
	return svg
			.append("g")
			.attr("clip-path", "url(#clip)")
			.selectAll("path")
			.data([someTime])
			.enter()
			.datum(someTime)
			.append("path")
			.attr("class", "line");
}

var clip = d3.selectAll(".focus")
				.append("svg:clipPath")
				.attr("id", "clip")
				.append("svg:rect")
				.attr("width", width - margin.left)
				.attr("height", height - margin.top - margin.top)
				.attr("x", margin.left)
				.attr("y", margin.top);

var zoomDistance = zoom(d3.zoom())
					.on("zoom", zoomDistance);

var zoomShipSpeed = zoom(d3.zoom())
					.on("zoom", zoomShipSpeed);

var zoomAirTemp = zoom(d3.zoom())
					.on("zoom", zoomAirTemp);

var zoomWaterTemp = zoom(d3.zoom())
					.on("zoom", zoomWaterTemp);

var zoomHumidity = zoom(d3.zoom())
					.on("zoom", zoomHumidity);

var zoomPressure = zoom(d3.zoom())
					.on("zoom", zoomPressure);

var zoomWind = zoom(d3.zoom())
					.on("zoom", zoomWind);

var zoomIndexUV = zoom(d3.zoom())
					.on("zoom", zoomIndexUV);

function zoom(zoom) {
	return zoom
			.scaleExtent([1, 100])
			.translateExtent([[margin.left, 0], [width, height - margin.top]])
			.extent([[margin.left, 0], [width, height - margin.top]]);
}

d3.json("data/world.json")
	.then(world => {
		drawMap(world);

		d3.csv("data/mockup-cruise-entries.csv")
			.then(csv => {
				csv.forEach((d) => {
						var data = new Date(d.time);
						d.Data = data;
						d.distance = +d.distance;
						d.shipSpeed = +d.shipSpeed;
						d.temperature = +d.temperature;
						d.waterTemperature = +d.waterTemperature;
						d.humidity = +d.humidity;
						d.pressure = +d.pressure;
						d.appWindSpeed = +d.appWindSpeed;
						d.computedWindSpeed = +d.computedWindSpeed;
						d.UVIndex = +d.UVIndex;
						d.boatPosition = [+d.lon, +d.lat];
						d.shipDirection = +d.shipDirection;
						d.appWindDir = +d.appWindDir;
						d.computedWindDir = +d.computedWindDir;
				});

				csv.sort((a, b) => (new Date(a.time) - new Date(b.time)));
				
				var temp = 0;
				for (var j = 0; j < csv.length; j += 60) {
					if (temp == stages.length)
						someTime.push(csv[j])
					else {
						if (csv[j].Data == stages[temp].DataArrivo) {
							temp++;
						} else if (csv[j].Data > stages[temp].DataArrivo) {
							for (var i = 0; i < csv.length; i++)
								if (csv[i].time == stages[temp].dataArrivo)
									break;
							someTime.push(csv[i]);
							temp++;
						}
						someTime.push(csv[j]);
					}
				}

				drawLineDistance();
				drawLineShipSpeed();
				drawLineAirTemp();
				drawLineWaterTemp();
				drawLineHumidity();
				drawLinePressure();
				drawLineWind("computedWind", true);
				drawLineIndexUV();

				focus = d3.selectAll(".focus")
							.append("g")
							.style("display", "none");

				appendLines();
		
				hover(svgD);
				svgD.selectAll("rect")
					.call(zoomDistance)
					.on("dblclick.zoom", null);

				hover(svgS);
				svgS.selectAll("rect")
					.call(zoomShipSpeed)
					.on("dblclick.zoom", null);
				
				hover(svgT);
				svgT.selectAll("rect")
					.call(zoomAirTemp)
					.on("dblclick.zoom", null);	

				hover(svgTw);
				svgTw.selectAll("rect")
					.call(zoomWaterTemp)
					.on("dblclick.zoom", null);
				
				hover(svgH);
				svgH.selectAll("rect")
					.call(zoomHumidity)
					.on("dblclick.zoom", null);
				
				hover(svgP);
				svgP.selectAll("rect")
					.call(zoomPressure)
					.on("dblclick.zoom", null);
				
				hover(svgW);
				svgW.selectAll("rect")
					.call(zoomWind)
					.on("dblclick.zoom", null);
				
				hover(svgUV);
				svgUV.selectAll("rect")
					.call(zoomIndexUV)
					.on("dblclick.zoom", null);

				d3.select("#titolo")
					.selectAll("#play")
					.on("mouseover", () => {
						d3.select("#play").style("cursor", "pointer"); 
					})
					.on("click", () => {
						if (!playAnimation) {
							playAnimation = true;
							d3.select("#play").attr("src", "immagini/pausa.png");
							play();
						} else {
							playAnimation = false;
							d3.select("#play").attr("src", "immagini/play.png");
							clearInterval(intervalID);
						}
					});
		})
		.catch(error => console.log(error));
	})
	.catch(error => console.log(error));

function zoomDistance() {
	var t = d3.event.transform;
	x.domain(t.rescaleX(x2).domain());
	svgD.select(".line").attr("d", lineDistance);
	svgD.select("#axis--x").call(d3.axisBottom(x));

	if(d3.event.sourceEvent.target == this) {
		svgS.selectAll("rect").call(zoomShipSpeed.transform, t);
		svgT.selectAll("rect").call(zoomAirTemp.transform, t);
    	svgTw.selectAll("rect").call(zoomWaterTemp.transform, t);
    	svgH.selectAll("rect").call(zoomHumidity.transform, t);
    	svgP.selectAll("rect").call(zoomPressure.transform, t);
    	svgW.selectAll("rect").call(zoomWind.transform, t);
    	svgUV.selectAll("rect").call(zoomIndexUV.transform, t);
  	}
}

function zoomShipSpeed() {
	var t = d3.event.transform;
	x.domain(t.rescaleX(x2).domain());
	svgS.select(".line").attr("d", lineShipSpeed);
	svgS.select("#axis--x").call(d3.axisBottom(x));

	if(d3.event.sourceEvent.target == this) {
		svgD.selectAll("rect").call(zoomDistance.transform, t);
		svgT.selectAll("rect").call(zoomAirTemp.transform, t);
    	svgTw.selectAll("rect").call(zoomWaterTemp.transform, t);
    	svgH.selectAll("rect").call(zoomHumidity.transform, t);
    	svgP.selectAll("rect").call(zoomPressure.transform, t);
    	svgW.selectAll("rect").call(zoomWind.transform, t);
    	svgUV.selectAll("rect").call(zoomIndexUV.transform, t);
  	}
}

function zoomAirTemp() {
	var t = d3.event.transform;
	x.domain(t.rescaleX(x2).domain());
	svgT.select(".line").attr("d", lineAirTemp);
	svgT.select("#axis--x").call(d3.axisBottom(x));

	if(d3.event.sourceEvent.target == this) {
		svgD.selectAll("rect").call(zoomDistance.transform, t);
		svgS.selectAll("rect").call(zoomShipSpeed.transform, t);
    	svgTw.selectAll("rect").call(zoomWaterTemp.transform, t);
    	svgH.selectAll("rect").call(zoomHumidity.transform, t);
    	svgP.selectAll("rect").call(zoomPressure.transform, t);
    	svgW.selectAll("rect").call(zoomWind.transform, t);
    	svgUV.selectAll("rect").call(zoomIndexUV.transform, t);
  	}
}

function zoomWaterTemp() {
	var t = d3.event.transform;
	x.domain(t.rescaleX(x2).domain());
	svgTw.select(".line").attr("d", lineWaterTemp);
	svgTw.select("#axis--x").call(d3.axisBottom(x));

	if(d3.event.sourceEvent.target == this) {
		svgD.selectAll("rect").call(zoomDistance.transform, t);
		svgS.selectAll("rect").call(zoomShipSpeed.transform, t);
    	svgT.selectAll("rect").call(zoomAirTemp.transform, t);
    	svgH.selectAll("rect").call(zoomHumidity.transform, t);
    	svgP.selectAll("rect").call(zoomPressure.transform, t);
    	svgW.selectAll("rect").call(zoomWind.transform, t);
    	svgUV.selectAll("rect").call(zoomIndexUV.transform, t);
  	}
}

function zoomHumidity() {
	var t = d3.event.transform;
	x.domain(t.rescaleX(x2).domain());
	svgH.select(".line").attr("d", lineHumidity);
	svgH.select("#axis--x").call(d3.axisBottom(x));

	if(d3.event.sourceEvent.target == this) {
		svgD.selectAll("rect").call(zoomDistance.transform, t);
		svgS.selectAll("rect").call(zoomShipSpeed.transform, t);
    	svgT.selectAll("rect").call(zoomAirTemp.transform, t);
    	svgTw.selectAll("rect").call(zoomWaterTemp.transform, t);
    	svgP.selectAll("rect").call(zoomPressure.transform, t);
    	svgW.selectAll("rect").call(zoomWind.transform, t);
    	svgUV.selectAll("rect").call(zoomIndexUV.transform, t);
  	}
}

function zoomPressure() {
	var t = d3.event.transform;
	x.domain(t.rescaleX(x2).domain());
	svgP.select(".line").attr("d", linePressure);
	svgP.select("#axis--x").call(d3.axisBottom(x));

	if(d3.event.sourceEvent.target == this) {
		svgD.selectAll("rect").call(zoomDistance.transform, t);
		svgS.selectAll("rect").call(zoomShipSpeed.transform, t);
    	svgT.selectAll("rect").call(zoomAirTemp.transform, t);
    	svgTw.selectAll("rect").call(zoomWaterTemp.transform, t);
    	svgH.selectAll("rect").call(zoomHumidity.transform, t);
    	svgW.selectAll("rect").call(zoomWind.transform, t);
    	svgUV.selectAll("rect").call(zoomIndexUV.transform, t);
  	}
}

function zoomWind() {
	var t = d3.event.transform;
	x.domain(t.rescaleX(x2).domain());
	if (vento == "appWind")
		svgW.select(".line").attr("d", lineAppWindSpeed);
	else
		svgW.select(".line").attr("d", lineComputedWindSpeed);
	svgW.select("#axis--x").call(d3.axisBottom(x));

	if(d3.event.sourceEvent.target == this) {
		svgD.selectAll("rect").call(zoomDistance.transform, t);
		svgS.selectAll("rect").call(zoomShipSpeed.transform, t);
    	svgT.selectAll("rect").call(zoomAirTemp.transform, t);
    	svgTw.selectAll("rect").call(zoomWaterTemp.transform, t);
    	svgH.selectAll("rect").call(zoomHumidity.transform, t);
    	svgP.selectAll("rect").call(zoomPressure.transform, t);
    	svgUV.selectAll("rect").call(zoomIndexUV.transform, t);
  	}
}

function zoomIndexUV() {
	var t = d3.event.transform;
	x.domain(t.rescaleX(x2).domain());
	svgUV.select(".line").attr("d", lineIndexUV);
	svgUV.select("#axis--x").call(d3.axisBottom(x));

	if(d3.event.sourceEvent.target == this) {
		svgD.selectAll("rect").call(zoomDistance.transform, t);
		svgS.selectAll("rect").call(zoomShipSpeed.transform, t);
    	svgT.selectAll("rect").call(zoomAirTemp.transform, t);
    	svgTw.selectAll("rect").call(zoomWaterTemp.transform, t);
    	svgH.selectAll("rect").call(zoomHumidity.transform, t);
    	svgP.selectAll("rect").call(zoomPressure.transform, t);
    	svgW.selectAll("rect").call(zoomWind.transform, t);
  	}
}

function drawAxes(svg, asseX, asseY) {
	x.domain(d3.extent(someTime, d => d.Data ));
	x2.domain(x.domain());

	var assi = svg
				.append("g")
				.attr("transform", 
						"translate(" + margin.left + "," + 0 + ")");

	assi.append("g")
			.attr("id", "axis--x")
			.attr("transform", 
					"translate(" + -margin.left + "," + (height - margin.top) + ")")
			.call(d3.axisBottom(asseX));

	assi.append("g")
			.attr("id", "axis--y")
			.call(d3.axisLeft(asseY));
}

function drawMap(world) {
	proj = d3.geoMercator().scale(8000).translate([-1050, 6700]);

	var path = d3.geoPath().projection(proj);

	var countries = topojson.feature(world, world.objects.countries);

	d3.select("#map")
		.selectAll("path")
		.data(countries.features)
		.enter()
		.filter(d => (d.id == "ITA" || d.id == "FRA"))
		.append("path")
		.attr("d", d => path(d))
		.attr("class", "countries")
		.attr("id", d => d.id);

	var triangle = "M0 -15 L-10 10 L10 10 Z";

	d3.select("#map")
		.append("svg:path")
		.attr("class", "led")
		.attr("d", triangle)
		.style("display", "none");

	d3.csv("data/cruise_stages.csv")
		.then(csv => {
			csv.forEach((d) => {
				var data = new Date(d.dataArrivo);
				d.DataArrivo = data;
				data = new Date(d.dataPartenza);
				d.DataPartenza = data;
				d.coordinates = [+d.lon, +d.lat];
			});

			stages = csv;
			
			drawStages();
		})
		.catch(error => console.log(error));
}

function drawLineDistance() {
	y.domain([0, d3.max(someTime, d => d.distance)]);

	drawAxes(svgD, x, y);

	var line = line_chart(svgD)
					.attr("d", lineDistance);

	lineChartAnimation(line);
}

function drawLineShipSpeed() {
	y1.domain([0, d3.max(someTime, d => d.shipSpeed)]);

	drawAxes(svgS, x, y1);

	var line = line_chart(svgS)
					.attr("d", lineShipSpeed);

	lineChartAnimation(line);
}

function drawLineAirTemp() {
	y2.domain([0, d3.max(someTime, d => d.temperature)]);

	drawAxes(svgT, x, y2);

	var line = line_chart(svgT)
					.attr("d", lineAirTemp);

	lineChartAnimation(line);
}

function drawLineWaterTemp() {
	y3.domain([0, d3.max(someTime, d => d.waterTemperature)]);

	drawAxes(svgTw, x, y3);

	var line = line_chart(svgTw)
					.attr("d", lineWaterTemp);

	lineChartAnimation(line);
}

function drawLineHumidity() {
	y4.domain([0, d3.max(someTime, d => d.humidity)]);

	drawAxes(svgH, x, y4);

	var line = line_chart(svgH)
					.attr("d", lineHumidity);

	lineChartAnimation(line);
}

function drawLinePressure() {
	y5.domain([d3.min(someTime, d => d.pressure) - 5, d3.max(someTime, d => d.pressure) + 5]);

	drawAxes(svgP, x, y5);

	var line = line_chart(svgP)
					.attr("d", linePressure);

	lineChartAnimation(line);
}

function drawLineWind(aWind, assi) {
	var lineGenerator;
	if (aWind == "appWind") {
		lineGenerator = lineAppWindSpeed;
		y6.domain([0, d3.max(someTime, d => d.appWindSpeed)]);
		vento = "appWind";
	} else {
		lineGenerator = lineComputedWindSpeed;
		y6.domain([0, d3.max(someTime, d => d.computedWindSpeed)]);
		vento = "computedWind";
	}

	svgW.selectAll("path")
		.data([someTime])
		.join(
			(enter) => {
				var line = enter
							.datum(someTime)
							.append('path')
							.attr("d", lineGenerator)
							.attr("clip-path", "url(#clip)")
							.attr("class", "line");
				if (lineAnimation) {
					lineAnimation = false;
					lineChartAnimation(line);
				}

				return enter;
			},
			(update) => 
				update.datum(someTime)
						.transition()
						.duration(1000)
						.attr("d", lineGenerator),
			(exit) => exit
		);
	if (assi)
		drawAxes(svgW, x, y6);
}

function drawLineIndexUV() {
	y7.domain([0, d3.max(someTime, d => d.UVIndex)]);

	drawAxes(svgUV, x, y7);

	var line = line_chart(svgUV)
					.attr("d", lineIndexUV);

	lineChartAnimation(line);
}

function lineChartAnimation(line) {
	var pathLength = line
						.node()
						.getTotalLength();
	
	var transitionPath = d3.transition()
						  	.ease(d3.easeSin)
						  	.duration(tempo);

	line.attr("stroke-dashoffset", pathLength)
		.attr("stroke-dasharray", pathLength)
		.transition(transitionPath)
		.attr("stroke-dashoffset", 0);

	setTimeout(() => {
		line.attr("stroke-dashoffset", null)
			.attr("stroke-dasharray", null)
		}, tempo);
}

function hover(svg) {
	
	var bisect = d3.bisector(d => d.Data).left;

	var overlay 
			= svg
				.append("rect")
				.attr("class", "overlay")
				.attr("x", margin.left)
				.attr("y", 0)
				.attr("width", width - margin.left)
				.attr("height", height)
				.on("mouseover",
						function() {
							displayLed(svg);
				})
				.on("mousemove", mousemove)
				.on("mouseout", 
						function() {
							d3.selectAll(".highlight")
								.classed("highlight", false);
				});

	function mousemove() {
		if (!playAnimation) {
			var x0 = x.invert(d3.mouse(this)[0]);
			var i = bisect(someTime, x0, 1);
			var dato;
			if (i == someTime.length) {
				dato = someTime[i - 1];
				j = i - 1;
			} else {
				var	d0 = someTime[i - 1];
				var d1 = someTime[i];
				
				if ((x0 - d0.Data) > (d1.Data - x0)) {
					j = i;
					dato = d1;
				} else {
					j = i - 1;
					dato = d0;
				}
			}

			if (!((x(dato.Data) < margin.left) 
					|| (x(dato.Data) > width))) {
				moveData(dato);
				updateInfoBox(dato);
			}
		}
	}

}

function moveData(d) {
	d3.selectAll("#horizontal")
		.attr("x1", x(d.Data) - margin.left);

	svgD.selectAll(".led")
		.attr("transform", 
				"translate(" + x(d.Data) + "," + y(d.distance) + ")");

	svgD.selectAll("#horizontal")
		.attr("transform", 
				"translate(" + margin.left + "," + y(d.distance) + ")");

	svgD.selectAll("#vertical")
		.attr("y1", height - margin.top - y(d.distance))
		.attr("transform", 
				"translate(" + x(d.Data) + "," + y(d.distance) + ")");

	svgS.selectAll(".led")
		.attr("transform", 
				"translate(" + x(d.Data) + "," + y1(d.shipSpeed) + ")");

	svgS.selectAll("#horizontal")
		.attr("transform", 
				"translate(" + margin.left + "," + y1(d.shipSpeed) + ")");

	svgS.selectAll("#vertical")
		.attr("y1", height - margin.top - y1(d.shipSpeed))
		.attr("transform", 
				"translate(" + x(d.Data) + "," + y1(d.shipSpeed) + ")");

	svgT.selectAll(".led")
		.attr("transform", 
				"translate(" + x(d.Data) + "," + y2(d.temperature) + ")");

	svgT.selectAll("#horizontal")
		.attr("transform", 
				"translate(" + margin.left + "," + y2(d.temperature) + ")");

	svgT.selectAll("#vertical")
		.attr("y1", height - margin.top - y2(d.temperature))
		.attr("transform", 
				"translate(" + x(d.Data) + "," + y2(d.temperature) + ")");

	svgTw.selectAll(".led")
		.attr("transform", 
				"translate(" + x(d.Data) + "," + y3(d.waterTemperature) + ")");

	svgTw.selectAll("#horizontal")
		.attr("transform", 
				"translate(" + margin.left + "," + y3(d.waterTemperature) + ")");

	svgTw.selectAll("#vertical")
		.attr("y1", height - margin.top - y3(d.waterTemperature))
		.attr("transform", 
				"translate(" + x(d.Data) + "," + y3(d.waterTemperature) + ")");

	svgH.selectAll(".led")
		.attr("transform", 
				"translate(" + x(d.Data) + "," + y4(d.humidity) + ")");

	svgH.selectAll("#horizontal")
		.attr("transform", 
				"translate(" + margin.left + "," + y4(d.humidity) + ")");

	svgH.selectAll("#vertical")
		.attr("y1", height - margin.top - y4(d.humidity))
		.attr("transform", 
				"translate(" + x(d.Data) + "," + y4(d.humidity) + ")");

	svgP.selectAll(".led")
		.attr("transform", 
				"translate(" + x(d.Data) + "," + y5(d.pressure) + ")");

	svgP.selectAll("#horizontal")
		.attr("transform", 
				"translate(" + margin.left + "," + y5(d.pressure) + ")");

	svgP.selectAll("#vertical")
		.attr("y1", height - margin.top - y5(d.pressure))
		.attr("transform", 
				"translate(" + x(d.Data) + "," + y5(d.pressure) + ")");

	if (vento == "appWind") {
		svgW.selectAll(".led")
			.attr("transform", 
					"translate(" + x(d.Data) + "," + y6(d.appWindSpeed) + ")");

		svgW.selectAll("#horizontal")
			.attr("transform", 
					"translate(" + margin.left + "," + y6(d.appWindSpeed) + ")");

		svgW.selectAll("#vertical")
			.attr("y1", height - margin.top - y6(d.appWindSpeed))
			.attr("transform", 
					"translate(" + x(d.Data) + "," + y6(d.appWindSpeed) + ")");
	} else {
		svgW.selectAll(".led")
			.attr("transform", 
					"translate(" + x(d.Data) + "," + y6(d.computedWindSpeed) + ")");

		svgW.selectAll("#horizontal")
			.attr("transform", 
					"translate(" + margin.left + "," + y6(d.computedWindSpeed) + ")");

		svgW.selectAll("#vertical")
			.attr("y1", height - margin.top - y6(d.computedWindSpeed))
			.attr("transform", 
					"translate(" + x(d.Data) + "," + y6(d.computedWindSpeed) + ")");
	}

	svgUV.selectAll(".led")
		.attr("transform", 
				"translate(" + x(d.Data) + "," + y7(d.UVIndex) + ")");

	svgUV.selectAll("#horizontal")
		.attr("transform", 
				"translate(" + margin.left + "," + y7(d.UVIndex) + ")");

	svgUV.selectAll("#vertical")
		.attr("y1", height - margin.top - y7(d.UVIndex))
		.attr("transform", 
				"translate(" + x(d.Data) + "," + y7(d.UVIndex) + ")");

	d3.select("#map")
		.selectAll(".led")
		.attr("transform", "translate(" + proj([d.boatPosition[0],
													d.boatPosition[1]]) + ") scale(.5) rotate(" + d.shipDirection + ")");
}

function drawStages() {
	var marker = "M0,0l-8.8-17.7C-12.1-24.3-7.4-32," 
					+ "0-32h0c7.4,0,12.1,7.7,8.8,14.3L0,0z";

	d3.select("#map")
		.selectAll(".marker")
	    .data(stages)
	    .join(enter =>
	    	enter
	    		.append("svg:path")
				.attr("class", "marker")
				.attr("id", d => d.codice)
				.attr("d", marker)
				.call(
					enter => {
						mouseoverMarker(enter);
						mouseoutMarker(enter);
							
						return enter
								.transition()
								.duration(tempo)
								.attr("transform", d => 
									"translate(" + proj([d.coordinates[0],
													d.coordinates[1]]) + ") scale(.75)");
				})
		);
}

function mouseoverMarker(set) {
	set.on("mouseover", 
		d => {	
			d3.select("#" + d.codice)
				.classed("marker", false)
				.classed("selectedMarker", true);
				
			tooltip
				.transition()		
				.duration(200)		
				.style("opacity", .9);

			var oraArrivo = d.DataArrivo.getHours();
			var minArrivo = d.DataArrivo.getMinutes();
			var oraPartenza = d.DataPartenza.getHours();
			var minPartenza = d.DataPartenza.getMinutes();

			if (oraArrivo < 10) 
				oraArrivo = "0" + oraArrivo;

			if (minArrivo < 10)
				minArrivo = "0" + minArrivo;

			if (oraPartenza < 10) 
				oraPartenza = "0" + oraPartenza;

			if (minPartenza < 10)
				minPartenza = "0" + minPartenza;

			if (d.tappa == "Olbia") {
				tooltip
					.html("Stop: " + d.tappa + "<br>" + 
							"Departure time: " + oraPartenza + ":" + minPartenza + "<br>" + 
							"Date: " + d.DataPartenza.toLocaleDateString())	
					.style("left", (d3.event.pageX + 15) + "px")		
					.style("top", (d3.event.pageY - 28) + "px");
			} else {
				tooltip
					.html("Stop: " + d.tappa + "<br>" + 
							"Arrival time: " + oraArrivo + ":" + minArrivo + "<br>" +
							"Departure time: " + oraPartenza + ":" + minPartenza + "<br>" + 
							"Date: " + d.DataPartenza.toLocaleDateString())	
					.style("left", (d3.event.pageX + 15) + "px")		
					.style("top", (d3.event.pageY - 28) + "px");
			}

			for (var i = 0; i < someTime.length; i++)
				if (someTime[i].time == d.dataArrivo)
					break;
			if (!playAnimation) {
				if (x(someTime[i].Data) < margin.left || x(someTime[i].Data) > width)
					focus.style("display", "none");
				else
					displayLed();

				updateInfoBox(someTime[i]);
				moveData(someTime[i]);
				j = i;
			}
	});
}

function mouseoutMarker(set) {
	set.on("mouseout", 
		d => {
			d3.select("#map")
				.selectAll("#" + d.codice)
				.classed("selectedMarker", false)
				.classed("marker", true);

			tooltip.transition()		
				.duration(500)
				.style("opacity", 0);	
	});
}

function updateInfoBox(dato) {
	var windS;
	var windD;
	if(vento == "computedWind") {
		windS = dato.computedWindSpeed;
		windD = dato.computedWindDir;
	} else {
		windS = dato.appWindSpeed;
		windD = dato.appWindDir;
	}

	var string;
	if (dato.UVIndex >= 0 && dato.UVIndex <= 0.99)
		string = "- Very low sun's UV rays intensity," 
					+ " no protection needed.";
	else if (dato.UVIndex >= 1 && dato.UVIndex <= 2.99)
		string = "- Low sun's UV rays intensity, "
					+ "you must wear sunglasses on bright days.";
	else if (dato.UVIndex >= 3 && dato.UVIndex <= 5.99)
		string = "- Moderate sun's UV rays intensity, "
					+ "you must wear sunglasses " 
					+ "and apply low or medium factor sunscreen.";

	var info = [{testo: "More info", value: "", unit: ""},
				{testo: "Distance travaled:", value: dato.distance, unit: "[m]"}, 
				{testo: "Ship speed:", value: dato.shipSpeed, unit: "[knots]"},
				{testo: "Air temperature:", value: dato.temperature, unit: "[°C]"},
				{testo: "Water temperature:", value: dato.waterTemperature, unit: "[°C]"},
				{testo: "Humidity:", value: dato.humidity, unit: "[%]"},
				{testo: "Pressure:", value: dato.pressure, unit: "[hPa]"},
				{testo: "Wind speed:", value: windS, unit: "[knots]"},
				{testo: "Wind direction:", value: windD, unit: "[°]"},
				{testo: "UV index:", value: dato.UVIndex, unit: string}];

	infoBox.style("display", null);

	info.forEach((d, i) => {
		infoBox
			.select("#info" + i)
			.text(d.testo + " " + d.value + " " + d.unit);
	});
}

function play() {
	displayLed();

	intervalID = setInterval(() => {

		moveData(someTime[j]);
		updateInfoBox(someTime[j]);
		j++;

		if (j != someTime.length)
			if (x(someTime[j].Data) < margin.left)
				focus.style("display", "none");
			else
				displayLed();

		if (j == someTime.length || x(someTime[j].Data) > width) {
			clearInterval(intervalID);
			d3.select("#play").attr("src", "immagini/play.png");
			playAnimation = false;
			j = 0;
		}
	}, 50);
}

function displayLed(svg) {

	highlightInfo(svg);

	focus.style("display", null);
	d3.select("#map")
		.selectAll(".led")
		.style("display", null);
}

function highlightInfo(svg) {
	switch(svg) {
		case svgD:
			d3.select("#info1").attr("class", "highlight");
		break;

		case svgS:
			d3.select("#info2").attr("class", "highlight");
		break;

		case svgT:
			d3.select("#info3").attr("class", "highlight");
		break;

		case svgTw:
			d3.select("#info4").attr("class", "highlight");
		break;

		case svgH:
			d3.select("#info5").attr("class", "highlight");
		break;

		case svgP:
			d3.select("#info6").attr("class", "highlight");
		break;

		case svgW:
			d3.select("#info7").attr("class", "highlight");
			d3.select("#info8").attr("class", "highlight");
		break;

		case svgUV:
			d3.select("#info9").attr("class", "highlight");
		break;
	}
}

function appendLines() {
	focus.append("line")
		.attr("id", "vertical")
		.attr("stroke", "#666")
		.attr("stroke-width", 0.5);

	focus.append("line")
		.attr("id", "horizontal")
		.attr("stroke", "#666")
		.attr("stroke-width", 0.5);
		
	focus.append("circle")
		.attr("class", "led")
		.attr("r", 4);
}