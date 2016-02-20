var model = Snap("#model");

var INIT = function(logic){

	// Loop!
	var updateLoop = function(){

		// Clear everything first
		var runtime = {};

		// Which ones to graph: HARDCODED...
		var graphs = [
			{
				id: "AAA",
				color: "#bada55",
				history: []
			},
			{
				id: "BBB",
				color: "#cc2727",
				history: []
			}
		];

		// Record history
		var max = 500;
		var recordHistory = function(runtime, graphs){
			for(var i=0;i<graphs.length;i++){
				var graphObject = graphs[i];

				var value = Math.round(runtime[graphObject.id]*100)/100;
				if(isNaN(value)) value=0;

				graphObject.history.push(value);
				if(value>max) max=value;
			}
		};

		// Start
		Improv.act(runtime, logic.start);
		recordHistory(runtime, graphs);

		// For each cycle...
		for(var i=0;i<logic.cycles;i++){
			Improv.act(runtime, logic.cycle);
			recordHistory(runtime, graphs);
		}

		// Draw graph!
		var x_scale = 500/logic.cycles;
		var y_scale = 1;
		if(max>500){
			y_scale = 500/max;
		}
		model.clear();
		for(var i=0;i<graphs.length;i++){

			var graphObject = graphs[i];

			// convert to points for 500x500 graph
			var points = [];
			for(var j=0;j<graphObject.history.length;j++){
				var amount = graphObject.history[j];
				points.push(j*x_scale, 500-amount*y_scale);
			}

			// draw line
			model.polyline(points).attr({
				stroke: graphObject.color,
				strokeWidth: 2,
				fill: "none"
			});

		}

	}
	setInterval(updateLoop,1000/30);

	// Edit!
	Improv.edit(logic,"#editor");

};