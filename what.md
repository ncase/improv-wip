#Improv
a tool to make tools to make [explorable explanations](http://explorableexplanations.com/)

---

Let's say you have a model of a complex system.
And you want others to be able to play around with it, explore the system, change its rules, maybe even create their *own* models with it! Well, that's an incredibly specific goal to have, but hey, you're in luck.

**Improv** lets you write normal words in html like this...

    <div id="instructions">
    A "boid" is like a bird, but worse.
    Let's make {NUMBER count: min=0,max=100} boids,
    and paint 'em all {CHOOSE color: black, red, blue, random colors}!
    </div>

then somewhere in the code, you call this...

    Improv.edit(your_model_data,"#instructions");
    
which will give you something like this!

\[iframe]

But wait, there's more!
Not only can you use Improv as a tool to make interactives,
you can use Improv as a tool *to make tools* to make interactives.
Besides sliding numbers and selecting from dropdowns,
Improv also has the ability to let your readers "re-program" the system itself, without having to touch the messy code itself, and without fear of breaking everything.

Here's how. Again, you start with writing html normally like this:

    <div id="instructions">
    Let's make {NUMBER count: min=0,max=100} boids,
    and paint 'em all {CHOOSE color: black, red, blue, random colors}!
    
    Also, every "tick", each boid will do the following:
    {ACTIONS actions}
    </div>
    
Notice the `{ACTIONS actions}` at the end. That's where your reader will get to live-edit the behavior of the system! Somewhere else, you have to define what "actions" an object in your system can do, and what parameters can be changed. Like so:

	Improv.actions.move = {
		short: "Move forward...",
		editor: "Move forward by {NUMBER amount: min=0,max=50} pixels",
		act: function(boid,options){
			// code to make the boid move by [options.amount] pixels
		}
	};
	
Here's another one:
		
	Improv.actions.if_close = {
		short: "If close to...",
		editor: "If I'm within {NUMBER radius: min=0,max=500} pixels of "+
				 "{CHOOSE target: the mouse, another boid}, then..."+
				 "{ACTIONS actions}",
		act: function(boid,options){
			// code using options.radius, options.target & options.actions
		}
	};
	
Notice the `{ACTIONS actions}` part, *again.* This lets your reader create sub-actions for that action! Like my mama always said, recursion is its own reward.

Finally, you call `Improv.edit` again, and all that will give you something like this:

\[iframe]

Now you can make all kinds of flocks! But while boids are cool, <del>they aren't very useful.</del> (actually, [boids](https://en.wikipedia.org/wiki/Boids) are often used in game AI, movie CGI, and swarm robotics. If I extended this demo a bit more, maybe I could create a pretty useful, designer-friendly boid "scripting" tool???)

Luckily, because Improv is *independent* of the kind of model you give it, both authors and readers can use Improv to live-edit all kinds of things! Such as:

* **Simulation:** agent-based models, cellular automata<sup>1</sup>, complex networks, markov chains, stock-and-flow models, mathematical models
* **Journalism:** interactive data visualizations
* **Education:** learning about systems, learning Programming<sup>2</sup>
* **Misc Cool Stuff:** design tools for videogames, procedural art

Whatever it is, I'm excited to see what *you* can make with Improv. This tool, that makes tools, that make explorable explanations... that can make us into more active learners, more critical thinkers, better citizens of our shared world.

---

<sup>1</sup> In fact, Improv grew out of [an emoji-based cellular automata tool](http://ncase.me/simulating/) I made!

<sup>2</sup> That is, Programming as a way of *thinking*, not the idiosyncratic syntax that comes with any specific language. As Bret Victor once [said](http://worrydream.com/LearnableProgramming/), *“for fuck's sake, read [Mindstorms](http://books.google.com/books?id=HhIEAgUfGHwC&printsec=frontcover).”*

---

###TO DO:

* **Actually make tools with this.**    
I mean, that's the whole reason I made this, because it was getting tedious re-implementing the same "live editing" features over and over again. (I'm personally most interested in using Improv to make a tool to simulate complex networks, and agent-based models)
* **Support for variables & objects.**   
Once Improv can do variables, *then* it'll have real power. I'm thinking specifically of Complex Adaptive Systems – CAS need agents with varying properties, hence, it needs variables.
* **More Widgets.**    
Right now, the only "Widgets" are NUMBER, CHOOSE, and ACTIONS. It could use more. What about free-form text? What about graphical widgets, like a bell-curve-manipulator to choose your own probability distribution? Or what about *output* widgets, like graphs to show the state of the system?

---

    AUDIENCE: CDG PEEPS
    - they're programmers
    - they care about constructionism & cool new interfaces
    - they gots their own projects to worry about