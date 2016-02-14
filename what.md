#ZZZ
a tool to make tools to make [explorable explanations](http://explorableexplanations.com/)

---

Let's say you have a model of a complex system.
And you want others to be able to play around with it, explore the system, change its rules, maybe even create their *own* models with it! Well, that's an incredibly specific goal to have, but hey, you're in luck.

**ZZZ** lets you write normal words in html like this...

    <div id="instructions">
    A "boid" is like a bird, but worse.
    Let's make {NUMBER count: min=0,max=100} boids,
    and paint 'em all {CHOOSE color: black, red, blue, random colors}!
    </div>

then somewhere in the code, you call this...

    ZZZ.___(your_model_data,"#instructions");
    
which will give you something like this!

\[iframe]

But wait, there's more!
Not only can you use ZZZ as a tool to make interactives,
you can use ZZZ as a tool *to make tools* to make interactives.
Besides sliding numbers and selecting from dropdowns,
ZZZ also has the ability to let your readers "re-program" the system itself, without having to touch the messy code itself, and without fear of breaking everything.

Here's how. Again, you start with writing html normally like this:

    <div id="instructions">
    Let's make {NUMBER count: min=0,max=100} boids,
    and paint 'em all {CHOOSE color: black, red, blue, random colors}!
    
    Also, every "tick", each boid will do the following:
    {ACTIONS actions}
    </div>
    
Notice the `{ACTIONS actions}` at the end. That's where your reader will get to live-edit the behavior of the system! Somewhere else, you have to define what "actions" an object in your system can do, and what parameters can be changed. Like so:

	ZZZ.actions.move = {
		short: "Move forward...",
		editor: "Move forward by {NUMBER amount: min=0,max=50} pixels"
	};
	
	ZZZ.actions.turn = {
		short: "Turn left/right...",
		editor: "Turn {CHOOSE direction: left,right} by "+
				 "{NUMBER amount: min=0,max=10} degrees"
	};
	
	ZZZ.actions.steer = {
		short: "Steer towards/away...",
		editor: "Steer {CHOOSE direction: towards, away from} the "+
				 "{CHOOSE target: mouse, closest boid, boids in front of me} "+
				 "by {NUMBER amount: min=0,max=10} degrees"
	};
	
	ZZZ.actions.if_close = {
		short: "If close to...",
		editor: "If I'm within {NUMBER radius: min=0,max=500} pixels of "+
				 "{CHOOSE target: the mouse, another boid}, then..."+
				 "{ACTIONS actions}"
	};
	
Notice the `{ACTIONS actions}` at the end *again.* This lets your reader create sub-actions for that action! Like my mama always said, recursion is its own reward.

Finally, you call `ZZZ.___` again, and all that will give you something like this:

\[iframe]

Now you can make all kinds of flocks! But while boids are cool, <del>they aren't very useful.</del> (actually, [boids](https://en.wikipedia.org/wiki/Boids) are often used in game AI, movie CGI, and swarm robotics. If I extended this demo a bit more, maybe I could create a pretty useful, designer-friendly boid "scripting" tool???)

Luckily, because ZZZ is *independent* of the kind of model you give it, both authors and readers can use ZZZ to live-edit all kinds of things! Such as:

* **Simulation:** agent-based models, cellular automata<sup>1</sup>, complex networks, markov chains, stock-and-flow models, mathematical models
* **Journalism:** interactive data visualizations
* **Education:** learning about systems, learning Programming<sup>2</sup>
* **Misc Cool Stuff:** design tools for videogames, procedural art

Whatever it is, I'm excited to see what *you* can make with ZZZ. This tool, that makes tools, that make explorable explanations... that can make us into more active learners, more critical thinkers, better citizens of our shared world.

---

<sup>1</sup> In fact, ZZZ grew out of [an emoji-based cellular automata tool](http://ncase.me/simulating/) I made!

<sup>2</sup> That is, Programming as a way of *thinking*, not the idiosyncratic syntax that comes with any specific language. As Bret Victor once [said](http://worrydream.com/LearnableProgramming/), *“for fuck's sake, read [Mindstorms](http://books.google.com/books?id=HhIEAgUfGHwC&printsec=frontcover).”*

---

    AUDIENCE: CDG PEEPS
    - they're programmers
    - they care about constructionism & cool new interfaces
    - they gots their own projects to worry about