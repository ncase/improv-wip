// By default, the square is a yellow golden rectangle.
var data = {
	width: 162,
	height: 100,
	color: "yellow"
};

// UPDATE LOOP
var howdy = document.querySelector("#howdy");
setInterval(function(){

	howdy.style.width = data.width;
	howdy.style.height = data.height;

	var color;
	switch(data.color){
		case "red": color="hsl(0,80%,70%)"; break;
		case "orange": color="hsl(30,80%,70%)"; break;
		case "yellow": color="hsl(60,80%,70%)"; break;
		case "green": color="hsl(90,80%,70%)"; break;
		case "blue": color="hsl(210,80%,70%)"; break;
		case "purple": color="hsl(270,80%,70%)"; break;
		case "black": color="#333"; break;
		case "white": color="#fff"; break;
	}
	howdy.style.background = color;

},50);