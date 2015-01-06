---
title: Learnings from creating a Traversal Maze
layout: post.hbs
post: true
url : /articles/learnings-from-creating-a-traversal-maze/
description: The things I learned from taking a traversal algorithm and turning it into a maze game for my 404 page.
---

# Learnings from creating a Traversal Maze...


With the advent of my new site and a relative amount of spare time over christmas. I realised there was a lot to do to make it the piece of perfection I would like it to be. One of the things in the back of my head was coming up with something fun for the [404](/404) page. At about the same time I happened to re-read a favourite article of mine about [algorithms](http://bost.ocks.org/mike/algorithms/). I do not claim to know much about algorithms but the [article](http://bost.ocks.org/mike/algorithms/) is definitely cool with them all playing out on canvases.

Here the finished product to compare and see what I was aiming towards:

<iframe height='350' scrolling='no' src='//codepen.io/Matthew-Fowles/embed/jEMdvR/' frameborder='no' allowtransparency='true' allowfullscreen='true' style='width: 100%;'>See the Pen <a href='http://codepen.io/Matthew-Fowles/pen/jEMdvR/'>Traversal Maze</a> by Matthew Fowles (<a href='http://codepen.io/Matthew-Fowles'>@Matthew-Fowles</a>) on <a href='http://codepen.io'>CodePen</a>.
</iframe>

## Traversal Maze algorithm

A traversal algorithm is something that creates trees. You start at a point and then split into two directions. then you move in both directions and repeat. So to make this work for a maze we start in a corner and apply the same process. But we stop taking certain routes when we run out of space. As the paths are random  and due to the nature of the algorithm there will only ever be one route through the maze. This makes it ideal.


## The Idea

So I thought having a day free I would I would take to reverse engineering this [algorithm](http://bl.ocks.org/mbostock/70a28267db0354261476) and actually turn it into a maze game.

I knew the algorithm was implemented in Javascript and the code was running using canvas. The code is actually freely [available](http://bl.ocks.org/mbostock/70a28267db0354261476) so I would just build upon it. 

I split things up into a set of tasks that I would have to achieve:

*  Making the size of the grid dynamic.
*  Creating a map of all the possible paths.
*  Creating the players.
*  Calculating key inputs.
*  Calculating legal moves.
*  Removing the D3 dependency.
*  Working out a controls solution for touch devices.


## Making the grid dynamic

The first thing was by far the easiest. The grid was already dynamic to two variables. You could pass in any width and height and the grid would recalculate. So actually making the grid dynamic was as simple as calculating the window size on load and then creating the grid to those dimensions. 

``` js
var w = window,
    d = document,
    e = d.documentElement,
    g = d.getElementsByTagName('body')[0];

var x = w.innerWidth || e.clientWidth || g.clientWidth,
        y = w.innerHeight || e.clientHeight || g.clientHeight;

```

The minus is too add a little padding but could be easily removed.

``` js
var width = x - 16,
    height = y - 16;

``` 

Task one seemed extremely simple. When later inserting this into the [404](/404) page I did not want it to be the entire window. This can be resolved by calculating your container only dimensions instead of the whole window.


# Mapping all the possible paths

So The white squares make up our paths and the black(transparent) squares make the wall of the maze. So when we draw each white square we need to record that square and where it is in the grid.

The algorithm already has a function exploreFrontier() this function loops through all the grid and decides where each and every square is drawn. Lets take a look:

``` js
d3.timer(function() {
  var done, k = 0;
  while (++k < 50 && !(done = exploreFrontier()));
  return done;
});

function exploreFrontier() {
  if ((edge = popRandom(frontier)) == null) return true;

  var edge,
      i0 = edge.index,
      d0 = edge.direction,
      i1 = i0 + (d0 === N ? -cellWidth : d0 === S ? cellWidth : d0 === W ? -1 : +1),
      x0 = i0 % cellWidth,
      y0 = i0 / cellWidth | 0,
      x1,
      y1,
      d1,
      open = cells[i1] == null; // opposite not yet part of the maze

  context.fillStyle = open ? "white" : "black";
  if (d0 === N) fillSouth(i1), x1 = x0, y1 = y0 - 1, d1 = S;
  else if (d0 === S) fillSouth(i0), x1 = x0, y1 = y0 + 1, d1 = N;
  else if (d0 === W) fillEast(i1), x1 = x0 - 1, y1 = y0, d1 = E;
  else fillEast(i0), x1 = x0 + 1, y1 = y0, d1 = W;

  if (open) {
    fillCell(i1);
    cells[i0] |= d0, cells[i1] |= d1;
    context.fillStyle = "magenta";
    if (y1 > 0 && cells[i1 - cellWidth] == null) fillSouth(i1 - cellWidth), frontier.push({index: i1, direction: N});
    if (y1 < cellHeight - 1 && cells[i1 + cellWidth] == null) fillSouth(i1), frontier.push({index: i1, direction: S});
    if (x1 > 0 && cells[i1 - 1] == null) fillEast(i1 - 1), frontier.push({index: i1, direction: W});
    if (x1 < cellWidth - 1 && cells[i1 + 1] == null) fillEast(i1), frontier.push({index: i1, direction: E});
  }
}

```

The d3 timer function before the explore frontier function will call the explore frontier function until it returns true. So the explore frontier function is run on every cell. So for each time we call this function we just need to record the position of said cell and where it it is.

Create an empty array bound to layout at the start:

``` js
var layout = []; 
```

Then at the end of our explore frontier function we simply insert this code:

``` js 
layout.push({
    x: x1,
    y: y1,
    d0: d0,
    d1: d1
});
```

We join on to the end of the array. The X and the Y positions tell us the position of this square. The d0 and d1 tell us something we will need to calculate legal moves which will come later on. With this we should now produce an array of all the squares and their positions.


# Creating the players

Before we start calculating the moves we can make. We need to create the players. When drawing the players the first time round we need pass in the grid position we which them to appear and calculate where to draw from this.

Lets create our draw function (This function also draws the finish dot):

``` js
function drawPlayer(position) {

		// Clear the canvas and update the global position variable
        game.clearRect(0, 0, width, height);
        currentPosition = position;

		// Calculate the x and why coordinates so we can place them
        var playerX = position.x * cellSize + (position.x + 1) * cellSpacing;
        var playerY = position.y * cellSize + (position.y + 1) * cellSpacing

        var finishX = maxX * cellSize + (maxX + 1) * cellSpacing;
        var finishY = 0 * cellSize + (0 + 1) * cellSpacing

		/// Draw the pieces 
        game.beginPath();
        game.arc(finishX + (cellSize / 2), finishY + (cellSize / 2), cellSize / 2, 0, 2 * Math.PI, false);
        game.fillStyle = "blue";
        game.fill();

        game.beginPath();
        game.arc(playerX + (cellSize / 2), playerY + (cellSize / 2), cellSize / 2, 0, 2 * Math.PI, false);
        game.fillStyle = "red";
        game.fill();
    }
``` 

We will always pass the function an object with an x value and a y value denoting where we want to draw the character next. The finish dot is hard coded and always stays in the same place. 

Then then calculate the x and y coordinates of the square. To do this we use a slightly modified version of the algorithm equation to get the position of the squares. 

``` js 
var playerX = position.x * cellSize + (position.x + 1) * cellSpacing;
var playerY = position.y * cellSize + (position.y + 1) * cellSpacing
```
We take the x number and times it by the cell size and then by the cell spacing we then add these values together to get the x position. We then draw the player.

``` js
game.beginPath();
        game.arc(playerX + (cellSize / 2), playerY + (cellSize / 2), cellSize / 2, 0, 2 * Math.PI, false);
        game.fillStyle = "red";
        game.fill(); 
``` 

We use the size of the cells to calculate the centre of the square which we need when drawing arcs.

# Clearing the rectangle

In canvas each time you want to remove something and redraw it. You need to clear a section of your canvas. A canvas is basically a flattened image and removing something from it is the same as cutting it out. When approaching this problem there seemed to be two obvious solutions: 

1. Cut out that specific square and re draw it.
2. Create another canvas that will hold the player and overlay on top.


I do not know why at the time I decided that 2nd route would be a simpler solution. I guess it was because I was stuck trying to work out all the calculations. But I went with the the idea of having a second canvas of the exact same size sitting directly on top.

``` js
	var canvas2 = document.createElement('canvas');

    canvas2.setAttribute("id", "canvas2");
    canvas2.setAttribute("width", width);
    canvas2.setAttribute("height", height);

    body[0].appendChild(canvas2);

    var game = canvas2.getContext("2d");
```

This one has a context of "game" and you will notice each time we redraw the player or the finish we use this context. This allows us too be able to easily clear the entire canvas each time we call the draw function.

``` js
game.clearRect(0, 0, width, height);
```

## Getting the users input

Getting hold of the users input is something quite easy. Because we want to pick up any input in the window we need to add a new event listener to the window bound on the key down event.

``` js
window.addEventListener("keydown", function(e) {

      var value = e.which;

      if(value === 37) moveWest(), e.preventDefault();
      if(value === 38) moveNorth(), e.preventDefault();
      if(value === 39) moveEast(), e.preventDefault();
      if(value === 40) moveSouth(), e.preventDefault();
     
      return false;
        
    });
```

The event listener will give us this "e" object which will contain information on which key specifically was pressed. Each key on the keyboard has a numerical value. You can find out which key binds to which numerical value [here](http://www.cambiaresearch.com/articles/15/javascript-char-codes-key-codes). 

We also want to prevent the default action happening when pressing this key as the arrows will cause scrolling. It's very important to make sure we call the prevent default after we have identified it's the right key. Otherwise we will stop all keys working like CMD+R for refresh.

## Calculating where we can move

Earlier when creating the layout array we logged the d0 and d1 values. These values are the position directions you could head from that square. Through trial and error it became clear that the legal moves (ones that did not go through walls) where always stored in the d1 value.

At the start of the algorithm a number is bound to each direction.

``` js
var N = 1 << 0,
    S = 1 << 1,
    W = 1 << 2,
    E = 1 << 3; 
``` 
Knowing that a number is bound to each direction we can then take d1 and see if the direction matches up. Some squares however have more then two joining squares. So how do we calculate these. When calling the function we calculate which squared you would want to move too and check that squares d1 to see if it's possible to move from there too the square we are on. So we have to calculate in both directions.  If there is no wall between the squares one of the squares d1 values will tell us it is legal. 

Here is the move north function:

``` js
function moveNorth() {
	  // calculate the square we want to move too
      var newY = currentPosition.y - 1;
      var newX = currentPosition.x;
      var newPosition;

	  // Check we are not moving of the edge of the grid
      if (newY < 0) return false;


	  // loop through layout array and find square we are trying to move to	
      for (var i = layout.length - 1; i >= 0; i--) {
        if(layout[i].x === newX && layout[i].y === newY) {
          newPosition = layout[i];
        }
      };

      // Check if we are on the last square and call game complete

      if(newPosition.x === maxX && newPosition.y === 0) {
        gameComplete();
      }

      // chack current and new square values to check if we can travel in the right directions

      if (( currentPosition.d1 === N) || (newPosition.d1 === S)) {
        drawPlayer(newPosition); 
      };

    }
```

We may want to be careful about the size of the maze as we are looping through many values in our array each time we try to make a move.

One problem that arose was going back to the first square after you leave. When the algorithm first draws it creates the first rectangle not using the exploreFrontier function. This is because it needs the first square to explore off of. So tho get round this we add that square to our array. Due to its nature it does not need d1 values. The squares joining it will tell us if it is legal to move too.

``` js
layout.push({x: 0, y: maxY, d1: 0, d0: 0})
```

We call this as soon as the maze has finished drawing.

We should at this point have ourselves a game more or less.


## Removing D3 for optimisation

[D3](http://d3js.org/) is a great library and I would definitely support using it if you have the need. In this case I do not feel we have the need. As this was to end up in my [404](/404) page I wanted it to be as light as possible. I currently have it at 8KB. So I started to look into why it was using [D3](http://d3js.org/). The only [D3](http://d3js.org/) function in use was the timer function for creating an animation loop and a selector function. For my use case it seemed silly to import an entire library for such so I set about removing it.

This part: 

``` js
	var canvas = d3.select("body").append("canvas")
    .attr("width", width)
    .attr("height", height);
```

Can easily be replaced with this to make massive savings.

``` js
	var canvas = document.createElement('canvas');

    canvas.setAttribute("id", "canvas");
    canvas.setAttribute("width", width);
    canvas.setAttribute("height", height);

    body[0].appendChild(canvas);
```

The timing function is a little harder. I obviously decided to go down the road of using request animation frame poly-fill. Instead of the [D3](http://d3js.org/) timer function I have a run function and then I use request animation frame to call this at up to 60 frames per second.

``` js 
(function() {
        var lastTime = 0;
        var vendors = ['ms', 'moz', 'webkit', 'o'];
        for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
            window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
            window.cancelAnimationFrame = window[vendors[x]+'CancelAnimationFrame'] 
                                       || window[vendors[x]+'CancelRequestAnimationFrame'];
        }
     
        if (!window.requestAnimationFrame)
            window.requestAnimationFrame = function(callback, element) {
                var currTime = new Date().getTime();
                var timeToCall = Math.max(0, 16 - (currTime - lastTime));
                var id = window.setTimeout(function() { callback(currTime + timeToCall); }, 
                  timeToCall);
                lastTime = currTime + timeToCall;
                return id;
            };
     
        if (!window.cancelAnimationFrame)
            window.cancelAnimationFrame = function(id) {
                clearTimeout(id);
            };
    }());

    function animate() {
        console.log('test');
        requestAnimationFrame(function() {
            if(!run()) {
                animate();
            }
        });
    }

    animate();
```

To know more about request animation frame you can read the legendary article by [Paul Irish here](http://www.paulirish.com/2011/requestanimationframe-for-smart-animating/). Also to see where I got the poly-fill and why this is the right one take a look [here](https://gist.github.com/paulirish/1579671).

Thats mean we have no gotten rid of the extra bloat of having [D3](http://d3js.org/) on the page.


## What to do about touch devices

This is something that is currently implemented on the 404 page only and not [Codepen](http://codepen.io). I realised that the maze would never work if you visit the site on a touch based device. I did not want to get rid of it on touch based devices as this seemed like an easy way out. So I decided to put a set of arrows on the page. I would calculate the size of the screen and make sure I could display both the maze and the arrows at the same time.

Here is how I detected if it was a touched based device:

``` js 
function is_touch_device() {
    return (('ontouchstart' in window) || (navigator.MaxTouchPoints > 0) || (navigator.msMaxTouchPoints > 0));
}
```

With that my maze was complete and ready for my [404](/404) page.

Here it is again finished. Try playing with the cellSize and cellSpacing variables to produce different reults.

<iframe height='350' scrolling='no' src='//codepen.io/Matthew-Fowles/embed/jEMdvR/' frameborder='no' allowtransparency='true' allowfullscreen='true' style='width: 100%;'>See the Pen <a href='http://codepen.io/Matthew-Fowles/pen/jEMdvR/'>Traversal Maze</a> by Matthew Fowles (<a href='http://codepen.io/Matthew-Fowles'>@Matthew-Fowles</a>) on <a href='http://codepen.io'>CodePen</a>.
</iframe>


## The end

I started this as a bit of fun too see if I could get something for my [404](/404) page. It has turned into a learning experience as I truly did not know anything about algorithms or heavy mathematics. It's surprising what you can create when you have a go. Just want to thank [Mike Bostock](http://bost.ocks.org/mike/) for making his algorithm available in the first place and an amazing article. I hope you like this run down!












