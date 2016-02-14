(function(exports){

// SCRUBBABLE NUMBER
Wordy.widgets.NUMBER = function(obj,path,args){

	// Args: min, max, [step=1], [default=null]
	var values = args.split(",");
	var argsObject = {};
	for(var i=0;i<values.length;i++){
		var keyvalue = values[i].split("=");
		argsObject[keyvalue[0]] = parseFloat(keyvalue[1]);
	}
	var min = argsObject.min;
	var max = argsObject.max;
	var step = argsObject.step ? argsObject.step : 1;
	var defaultVal = argsObject.default;

	// Initial value (if no initial value, make it between min & max)
	var initialValue = Wordy.getProperty(obj,path);
	if(initialValue===undefined){
		if(defaultVal){
			initialValue=defaultVal;
		}else{
			initialValue=(min+max)/2;
			initialValue=Math.round(initialValue/step)*step;
		}
	}

	// Create scrub number, with init value
	var scrub = document.createElement("span");
	scrub.className = "wordy_scrub";
	scrub.innerHTML = initialValue;

	// When you change the number
	var updateValue = function(value){

		// Calculate if it's within bounds
		if(value<min) value=min;
		if(value>max) value=max;

		// Make it a number
		value = parseFloat(value);

		// Make data & html change
		Wordy.setProperty(obj,path,value);
		scrub.innerHTML = value;

	};

	// Scrubbable UI
	scrub.addEventListener("mousedown",function(event){

		// Initial
		var initValue = Wordy.getProperty(obj,path);
		var initX = event.clientX;

		// Cursor!
		document.body.style.cursor = "col-resize";

		// Handlers
		var _onMouseMove = function(e){

			// Calculate & update new value
			var currX = e.clientX;
			var delta = Math.round((currX-initX)/2)*step; // one "step" per 2px
			var newValue = initValue + delta;
			updateValue(newValue);

			// to stop the user-select thing
			e.preventDefault();

		};
		var _onMouseUp = function(e){
			
			// Cursor!
			document.body.style.cursor = null;

			// Listeners
			window.removeEventListener("mousemove",_onMouseMove);
			window.removeEventListener("mouseup",_onMouseUp);

		};

		// Mouse Events
		window.addEventListener("mousemove",_onMouseMove);
		window.addEventListener("mouseup",_onMouseUp);

	},true);

	// Update, juuuuust in case.
	// (If no initVal, this sets it to the default.)
	updateValue(initialValue);
	
	// Return the scrubby
	return scrub;

};

// SELECT LIST
Wordy.widgets.CHOOSE = function(obj,path,args){

	// Initial value
	var initialValue = Wordy.getProperty(obj,path);

	// Create options
	// (a separate label & value is optional.)
	// (by default, label = value)
	var value, label;
	var options = args.split(",");
	for(var i=0;i<options.length;i++){
		var split = options[i].split("=");
		if(split.length==1){
			value = split[0];
			label = split[0];
		}else{
			value = split[0];
			label = split[1];
		}
		options[i] = {
			value: value,
			label: label
		};
	}

	// Create <select> with all options (select initial value)
	var selectDOM = _createSelect(options, initialValue);

	// Set data when you make a selection
	selectDOM.onchange = function(){
		var value = selectDOM.value;
		Wordy.setProperty(obj,path,value);
	};

	// Update, juuuuust in case.
	// (If no initVal, this sets it to the FIRST option.)
	selectDOM.onchange();

	// Return <select>
	return selectDOM;

};
var _createSelect = function(options, selectedValue){

	// Create <select> dom
	var selectDOM = document.createElement("select");
	for(var i=0;i<options.length;i++){

		var o = options[i];

		// Create option
		var optionDOM = document.createElement("option");
		optionDOM.innerHTML = o.label;
		optionDOM.setAttribute("value",o.value);
		if(o.value==selectedValue) optionDOM.setAttribute("selected","true");
		selectDOM.appendChild(optionDOM);

	}

	// return dom
	return selectDOM;

};

// ACTIONS - THIS ONE'S GONNA BE A DOOZY
Wordy.widgets.ACTIONS = function(obj,path,args){

	// The default would just be... an empty array, I s'pose.
	
	// Initial value (also, there should be no args???)
	var actionOptions = Wordy.getProperty(obj,path);
	// if no array, create an empty one.
	if(!actionOptions){
		actionOptions = [];
		Wordy.setProperty(obj,path,actionOptions);
	}

	// Create a div.
	var actionsDOM = document.createElement("div");

	/////////////////////
	// CREATE THE LIST //
	/////////////////////

	var list = document.createElement("ol");
	list.className = "wordy_list";
	actionsDOM.appendChild(list);

	// Help func to add editor to list, WITH WORDY.EDIT()
	var addEditorToList = function(actionOption){

		// List element
		var li = document.createElement("li");
		list.appendChild(li);

		// The action's editor
		var action = Wordy.getActionByID(actionOption.type);
		var dom = Wordy.edit(actionOption, action.editor);
		li.appendChild(dom);

		// The delete button
		var deleteButton = document.createElement("div");
		deleteButton.className = "wordy_delete_button";
		deleteButton.innerHTML = "⨂";
		deleteButton.onmouseover = function(){
			li.style.textDecoration = "line-through";
		};
		deleteButton.onmouseout = function(){
			li.style.textDecoration = null;
		};
		deleteButton.onclick = function(){

			// Remove from array
			var index = actionOptions.indexOf(actionOption);
			if(index<0) console.error("deleting an action that doesn't exist?!?!");
			actionOptions.splice(index,1);

			// Remove from this UI
			list.removeChild(li);

		};
		li.appendChild(deleteButton);

	};

	// Populate it with those actions + Wordy.edit()
	for(var i=0;i<actionOptions.length;i++){
		addEditorToList(actionOptions[i]);
	}

	//////////////////////////////////
	// CREATE THE NEW ACTION BUTTON //
	//////////////////////////////////

	var newButtonContainer = document.createElement("div");
	newButtonContainer.className = "wordy_list_new";
	actionsDOM.appendChild(newButtonContainer);

	// The button itself
	var newButton = document.createElement("div");
	newButton.innerHTML = "+new";
	newButtonContainer.appendChild(newButton);

	// The hidden Select list
	var options = [{
		label: "+new",
		value: null
	}];
	for(var actionID in Wordy.actions){
		options.push({
			label: Wordy.actions[actionID].label,
			value: actionID
		});
	}
	var selectDOM = _createSelect(options);
	newButtonContainer.appendChild(selectDOM);

	// New action when you make a selection
	selectDOM.onchange = function(){

		var value = selectDOM.value;
		if(!value) return; // just selected "+new" again.

		// New action appended to original array
		var actionOption = { type:value }; // default action of that type
		actionOptions.push(actionOption);

		// New action added to list, using Wordy.edit
		addEditorToList(actionOption);

		// reset the select DOM
		selectDOM.selectedIndex = 0;

	};

	// Return the full Actions DOM
	return actionsDOM;

}

})(window);