(function(exports){

// SINGLETON
var Improv = {};
exports.Improv = Improv;
Improv.widgets = {};
Improv.actions = {};

/************

Improv.edit(object,html);

Create an editor for an object, given some HTML.
object = an object, duh.
html = you can pass html code directly,
	   or pass a DOM element
	   or query selector to a DOM.

Returns a new created DOM, or the DOM you passed.

************/
Improv.root = null;
Improv.edit = function(object,html){

	// ROOT!
	Improv.root = Improv.root || object;

	// Get the html content
	var dom;
	if(typeof html==="string"){
		var _testIfValidSelector = function(selector) {
			try{ var foobar = document.querySelector(selector);
			}catch(error){ return false; }
			return true;
		};
		if(_testIfValidSelector(html)){
			dom = document.querySelector(html);
			html = dom.innerHTML; // it was a query selector
		}else{
			dom = document.createElement("span");
			html = html; // it was plain html code, make a DOM.
		}
	}else{
		dom = html;
		html = dom.innerHTML; // it was a direct DOM
	}

	// Clear current DOM
	dom.innerHTML = "";

	// Style that DOM
	dom.className = "improv";

	// Okay... Parsing this...
	// Split on {blah blah blah}, and keep the insides of those.
	var split = html.split(/\{([^{}]*)\}/);

	// For every even (0,2,4...) element, it's just a span.
	// For every odd (1,3,5...) element, it's a Widget to edit the OBJECT
	dom.widgets = []; // hack?
	for(var i=0;i<split.length;i++){
		
		// Config for a new node...
		var config = split[i];
		var node;

		if(i%2==0){
			// EVEN - just text
			node = document.createElement("span");
			node.innerHTML = config;
		}else{
			// ODD - it's a Widget to edit the OBJECT
			node = Improv.makeWidget(object,config);
			dom.widgets.push(node);
		}

		// Append that shtuff
		dom.appendChild(node);

	}

	// Hack? DIE:
	dom.die = function(){
		for(var i=0;i<dom.widgets.length;i++){
			var widget = dom.widgets[i];
			if(widget.die) widget.die();
		}
	}

	// Return old/new DOM
	return dom;

};

/************

Improv.makeWidget(object,config);

Create a widget from a string-config of this form:
"TYPE prop.path.name: args"

Each widget is defined as a function like this:
function(obj,path,args){
	// input and output for object[path]
	// returns a DOM
};

************/

Improv.makeWidget = function(object, config){

	// Parse config into widgetType, objectPath, args...
	var split = config.split(" ");

	// Widget type is easy.
	var widgetType = split[0];

	// Object path. Optional colon at the end, get rid of it.
	var objectPath = split[1];
	if(objectPath.slice(-1)==":"){
		objectPath = objectPath.slice(0,-1);
	}

	// If there's spaces in the args, join 'em...
	var args;
	if(split.length>3){
		var argArray = split.splice(2);
		args = argArray.join(" ");
	}else{
		args = split[2];
	}

	// Then, split THOSE args up by "," or ", "
	if(args){
		args = args.split(/,\s|,/); // to allow for "a,b,c" and "a, b, c"
	}else{
		args = [];
	}

	// Get the widget-making function
	var widgetFunc = Improv.widgets[widgetType];

	// Create the widget!
	var node = widgetFunc(object, objectPath, args);

	// Return the widget.
	return node;

};

/************

Improv.act(object,actionOptions);

Go through each actionOption, recursively if you have to,
and for each actionOption...

1. get the function call from actionOption's "type"
2. apply that function, with the object + the actionOption itself

************/

Improv.getActionByID = function(id){
	return Improv.actions[id];
};
Improv.act = function(object,actionOptions){

	for(var i=0;i<actionOptions.length;i++){

		// Got the "act" func
		var actionOption = actionOptions[i];
		actionOption = JSON.parse(JSON.stringify(actionOption)); // clone
		var action = Improv.getActionByID(actionOption.type);
		var act = action.act;

		// _VARS_
		// If it's a _get_, change it whatever
		for(var propName in actionOption){
			var prop = actionOption[propName];
			if(prop._get_){
				
				// Get it from the runtime object
				var value = object[prop._get_];
				actionOption[propName] = value;

			}
		}

		// Apply it!
		act(object,actionOption);

	}

};


/************

Improv.getProperty(object,path);
Improv.setProperty(object,path,value);
Improv.listen(object,path,callback);
Improv.unlisten(handler);

For all your getting & setting needs

************/

Improv.getProperty = function(obj,path){

	// Get it
	var pathSplit = path.split(".");
	var value = obj;
	for(var i=0;i<pathSplit.length;i++){
		var name = pathSplit[i];
		value = value[name];
	}
	return value;

};

Improv.setProperty = function(obj,path,value){

	var originalObject = obj;

	// Set it
	var pathSplit = path.split(".");
	for(var i=0;i<pathSplit.length-1;i++){
		var name = pathSplit[i];
		obj = obj[name];
	}
	var lastPropName = pathSplit[pathSplit.length-1];

	// Does it actually change?
	var prevValue = obj[lastPropName];
	if(obj[lastPropName]==value) return; // If not, stop here.
	obj[lastPropName] = value;

	// Call all listeners on the way up.
	// update path.prop.name
	// update path.prop
	// update path
	for(var i=pathSplit.length;i>=0;i--){

		// Sub path
		var subPath = pathSplit.slice(0,i).join(".");

		// If there's a listener, call it with the new value
		Improv.message(originalObject, subPath, value);

	}

};

Improv._listeners = [];

Improv.getListeners = function(obj,path){
	return Improv._listeners.filter(function(listener){
		return (listener.obj==obj && listener.path==path);
	});
};

Improv.message = function(obj, path, value){
	var listeners = Improv.getListeners(obj, path);
	for(var i=0;i<listeners.length;i++){
		listeners[i].callback(value);
	}
};

Improv.listen = function(obj, path, callback){

	// If only two params (obj, callback), path is ""
	if(!callback){
		callback = path;
		path = "";
	}

	// Add listener
	var listener = {
		obj: obj,
		path: path,
		callback: callback
	};
	Improv._listeners.push(listener);

	// Return it, too.
	return listener;

};

Improv.unlisten = function(handler){
	var index = Improv._listeners.indexOf(handler);
	if(index<0) throw "trying to un-listen to what was never listened";
	Improv._listeners.splice(index,1);
};


/************

Improv.setVar(obj, _var_, value);
  obj: is the runtime target object
_var_: the _var_ id
value: the new value, obviously~

************/

Improv.setVar = function(obj, _var_, value){
	obj[_var_] = value;
};

/************

Improv.getVarsByType(model, type);
model: the logic model
 type: the type	of var it is

Looks through the _vars_ array,
and returns only the vars (id AND name)
of those that match the type

************/

Improv.getVarsByType = function(model, type){
	var _vars_ = model._vars_;
	return _vars_.filter(function(_var_){
		return(_var_.type==type);
	});
};

/************

Improv.getVarByID(model, id);
model: the logic model
 type: the var ID

************/

Improv.getVarByID = function(model, id){
	var _vars_ = model._vars_;
	for(var i=0;i<_vars_.length;i++){
		var _var_ = _vars_[i];
		if(_var_.id==id) return _var_;
	}
	return null;
};


/************

Improv.generateUID();
Create a random 7-letter string
52^7 = 1,028,071,702,528 = ONE TRILLION
The chance of an UID collision?
Basically zero.

************/

Improv.generateUID = function(){
	var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
    for(var i=0; i<7; i++){
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
};


})(window);