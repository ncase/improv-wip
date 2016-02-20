Improv.actions.set_num = {
	label: "Create a number...",
	editor: "The number of {VAR _set_: type=number,name=something} is {NUM value}",
	act: function(obj,args){
		Improv.setVar(obj, args._set_, args.value);
	}
};

Improv.actions.do_math = {
	label: "Do math to two numbers...",
	editor: "The number of {VAR _set_: type=number,name=something} is {NUM a} {CHOOSE op: +,-,×,÷} {NUM b}",
	act: function(obj,args){
		var val;
		switch(args.op){
			case "+": val=args.a+args.b; break;
			case "-": val=args.a-args.b; break;
			case "×": val=args.a*args.b; break;
			case "÷": val=args.a/args.b; break;
		}
		Improv.setVar(obj, args._set_, val);
	}
};

Improv.actions.mod_num = {
	label: "Modify a number...",
	editor: "{CHOOSE op: +=Add to,-=Subtract,×=Multiple,÷=Divide} {VAR _set_: type=number,name=something} by {NUM value}",
	act: function(obj,args){
		var currentValue = Improv.getProperty(obj,args._set_);
		var modifier = args.value;
		var val;
		switch(args.op){
			case "+": val=currentValue+modifier; break;
			case "-": val=currentValue-modifier; break;
			case "×": val=currentValue*modifier; break;
			case "÷": val=currentValue/modifier; break;
		}
		Improv.setVar(obj, args._set_, val);
	}
};

Improv.actions.print = {
	label: "Print a number",
	editor: "Print {NUM value}",
	act: function(obj,args){
		output.innerHTML += "<br>" + args.value;
	}
};