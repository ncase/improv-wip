(function(exports){

// Helper: create freeform text
var _getFreeformText = function(){

	// Create input text
	var text = document.createElement("input");
	text.className = "improv_text";

	// On Change
	text.oninput = function(){

		// Change style
		var ruler = document.createElement("span");
		ruler.className = "improv_text";
		ruler.innerHTML = text.value;
		document.body.appendChild(ruler);
		var width = ruler.offsetWidth;
		document.body.removeChild(ruler);
		text.style.width = (width+10)+"px";

	};

	// Return input
	return text;

};

// FREE FORM TEXT
Improv.widgets.TEXT = function(obj,path,args){

	// Initial value
	var initialValue = Improv.getProperty(obj,path);

	// Default...
	if(!initialValue){
		initialValue = "new variable";
	}

	// Create input text
	var text = _getFreeformText();
	text.value = initialValue;

	// On Change
	var _changeStyle = text.oninput;
	text.oninput = function(){
		_changeStyle();
		Improv.setProperty(obj,path,text.value);
	};
	text.oninput();

	// Return input
	return text;

}

// NUMBER: Freeform, or, click (...) to connect to reference
Improv.widgets.NUM = function(obj,path,args){

	// Create container
	var container = document.createElement("span");
	container.className = "improv_inline";

	// Is This A Reference?
	var isReference = function(){
		var value = Improv.getProperty(obj,path);
		return (value && value.ref!==undefined);
	};

	//////////////////////
	// NUMBER ////////////
	//////////////////////

	// Create input text
	var numberInput = _getFreeformText();
	container.appendChild(numberInput);

	// On Change
	var _changeStyle = numberInput.oninput;
	numberInput.oninput = function(){
		_changeStyle();

		// If number or reference...
		var value = parseFloat(numberInput.value);
		if(isNaN(value)){
			// reference
		}else{
			Improv.setProperty(obj,path,value); // number
		}
		
	};

	//////////////////////
	// CHOOSE REF ////////
	//////////////////////

	// Get options
	var options = Improv.getReferences(Improv.root,"number");

	// Create choose select	
	var referenceInput = _createSelect(options);
	container.appendChild(referenceInput);

	// Set data when you make a selection
	referenceInput.onchange = function(){
		Improv.setProperty(obj,path,{
			ref: referenceInput.value
		});
	};

	//////////////////////
	// MORE (...) ////////
	//////////////////////

	// Create (...)
	var more = document.createElement("span");
	more.className = "improv_more";
	more.innerHTML = "⋯";
	container.appendChild(more);
	more.onclick = function(){
		var value;
		if(isReference()){
			value=0;
		}else{
			value={ref:""};
		}
		Improv.setProperty(obj,path,value);
		updateInterface();
	}

	//////////////////////
	// WHICH ONE /////////
	//////////////////////

	var updateInterface = function(){

		if(isReference()){
			
			// IT'S A REFERENCE

			// Hide & show
			numberInput.style.display = "none";
			referenceInput.style.display = "inline-block";

			// Initial or default value
			var value = Improv.getProperty(obj,path);
			if(!value || !value.ref) value={ref:""};

			// Set up the Reference Input
			for(var i=0;i<referenceInput.childNodes.length;i++){
				var option = referenceInput.childNodes[i];
				if(option.value==value){
					option.setAttribute("selected","true");
				}
			}
			referenceInput.onchange();

		}else{

			// IT'S A NUMBER

			// Hide & show
			numberInput.style.display = "inline-block";
			referenceInput.style.display = "none";

			// Initial or default value
			var value = Improv.getProperty(obj,path);
			if(!value || typeof value != "number") value=0;

			// Set up the Number Input
			numberInput.value = value;
			numberInput.oninput();

		}

	};	

	updateInterface();

	// Return input
	return container;

}

})(window);