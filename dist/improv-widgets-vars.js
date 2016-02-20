(function(exports){

// Helper: create freeform text
var _getFreeformText = function(){

	// Create input text
	var text = document.createElement("input");
	text.className = "improv_text";

	// On Click
	text.onclick = text.select;

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

// CREATING A _SET_ VAR
// {VAR _set_: type=number,name=something}
Improv.widgets.VAR = function(obj,path,args){

	// Args: min, max, [step=1], [default=null]
	var argsObject = {};
	for(var i=0;i<args.length;i++){
		var keyvalue = args[i].split("=");
		argsObject[keyvalue[0]] = keyvalue[1];
	}
	var type = argsObject.type;
	var name = argsObject.name;

	// What's the ID?!
	var varID = Improv.getProperty(obj,path);

	// If there is no ID, THEN IT'S TIME TO CREATE A NEW ONE!
	if(!varID){

		// Set locally
		varID = Improv.generateUID();

		// Set in logic model
		Improv.root._vars_.push({
			id: varID,
			type: type,
			name: name
		});

		// Set in action options
		Improv.setProperty(obj,"_set_",varID);

	}

	// Getter & Setter for the NAME.
	var getVarName = function(){
		return Improv.getVarByID(Improv.root, varID).name;
	};
	var setVarName = function(value){
		Improv.getVarByID(Improv.root, varID).name = value;
		Improv.message(Improv.root, "_vars_", value);
	};

	// Initial value, default
	var initialValue = getVarName();
	if(!initialValue) initialValue=name;

	// Create input text
	var text = _getFreeformText();
	text.value = initialValue;

	// On Change
	var _changeStyle = text.oninput;
	text.oninput = function(){
		_changeStyle();
		setVarName(text.value);
	};
	text.oninput();

	//////////////////////
	// DIE ///////////////
	//////////////////////

	text.die = function(){
		
		// Delete in logic model
		var _var_ = Improv.getVarByID(Improv.root, varID);
		var index = Improv.root._vars_.indexOf(_var_);
		Improv.root._vars_.splice(index,1);

		// HACK TODO - later, when you can make this var just set a previous one,
		// NOT creating a new one????

		// Tell peeps it's gone now
		Improv.message(Improv.root, "_vars_");

	};

	// Return input
	return text;

}

// NUMBER: Freeform, or, click (...) to connect to reference
Improv.widgets.NUM = function(obj,path,args){

	// Create container
	var container = document.createElement("span");
	container.className = "improv_inline";

	// Is This A _GET_ Variable?
	var _isVar = function(){
		var value = Improv.getProperty(obj,path);
		return (value && value._get_!==undefined); // value exists, and it's a _get_!
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

		// If number or _get_...
		var value = parseFloat(numberInput.value);
		if(isNaN(value)){
			return; // that... that is NOT a number you just typed
		}else{
			Improv.setProperty(obj,path,value); // number
		}
		
	};

	//////////////////////
	// CHOOSE _GET_ //////
	//////////////////////

	// Get options
	var _getOptions = function(){
		var optionsRaw = Improv.getVarsByType(Improv.root,"number");
		var options = [];
		for(var i=0;i<optionsRaw.length;i++){
			var o = optionsRaw[i];
			options.push({
				label: o.name,
				value: o.id
			});
		}
		return options;
	};

	// Create choose select	
	var getterInput = _createSelect(_getOptions());
	container.appendChild(getterInput);

	// Set data when you make a selection
	getterInput.onchange = function(){
		Improv.setProperty(obj,path,{
			_get_: getterInput.value
		});
	};

	// Thirty times a second, update options IF anything's changed.
	// Listen to changes
	var listener = Improv.listen(Improv.root, "_vars_", function(value){

		// Current value
		var currentValue = getterInput.value;

		// Rebuild list
		_createSelect(getterInput, _getOptions(), currentValue);

		// Update Interface
		updateInterface();

	});

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
		if(_isVar()){
			value=0;
		}else{
			value={_get_:""};
		}
		Improv.setProperty(obj,path,value);
		updateInterface();
	}

	//////////////////////
	// WHICH ONE /////////
	//////////////////////

	var updateInterface = function(){

		if(_isVar()){
			
			// IT'S A _GET_ VAR

			// IF THERE'S NO OPTIONS, FORCE-SWITCH TO NUMBER
			if(_getOptions().length==0){
				Improv.setProperty(obj,path,0);
				updateInterface();
				return;
			}

			// Hide & show
			numberInput.style.display = "none";
			getterInput.style.display = "inline-block";

			// Initial or default value
			var getter = Improv.getProperty(obj,path);
			if(!getter || !getter._get_) getter={_get_:""};
			var varID = getter._get_;

			// Set up the Reference Input
			for(var i=0;i<getterInput.childNodes.length;i++){
				var option = getterInput.childNodes[i];
				if(option.value==varID){
					option.setAttribute("selected","true");
				}
			}
			getterInput.onchange();

		}else{

			// IT'S A NUMBER

			// Hide & show
			numberInput.style.display = "inline-block";
			getterInput.style.display = "none";

			// Initial or default value
			var value = Improv.getProperty(obj,path);
			if(!value || typeof value != "number") value=0;

			// Set up the Number Input
			numberInput.value = value;
			numberInput.oninput();

		}

	};	

	updateInterface();

	//////////////////////
	// DIE ///////////////
	//////////////////////

	container.die = function(){
		Improv.unlisten(listener);
	};

	// Return input
	return container;

}

})(window);