/*

# Reel JS

This is the JS for the reel JS plugin. This plugin
is used to caused animations when scrolling up and
down a page.

liscense: MIT
Author: Matthew Fowles

*/



(function(w, d) {



    var reel = {};
    reel.scrollers = []; // the array all animated elements will stored in with animation info.
    reel.scroll = 0; // Current scroll point of the page


    /* 

    ## init **function**
	
	Start request animation frame and run get 
    scroll to update current scroll position.
    Then run update to update elements.
    Animation runs recursivly throughout. this is better 
    than binding to the window on scroll event.

    Thanks to @rikroots for pointing this out.

    */

    reel.init = function() {

        reel.getScroll();

        function animate() {
            requestAnimationFrame(function() {
                reel.getScroll();
                reel.update();
                animate();
            });
        }

        animate();

    };


    /* 

    ## getScroll **function**

    	Get the current vertical scroll coords of the document.
        Polyfill if there is no widow y axis offset.

    */

    reel.getScroll = function() {

        if (w.pageYOffset !== undefined) {
            reel.scroll = pageYOffset;
        } else {
            var sy,
                r = d.documentElement,
                b = d.body;
            sy = r.scrollTop || b.scrollTop || 0;
            reel.scroll = sy;
        }
    };


    /* 

    ## update **function**

	check if we have any scrollers currently if so pass each
	one individually to the calculate fuction;

    */


    reel.update = function() {
        if (reel.scrollers.length > 0) {
            for (var i = reel.scrollers.length - 1; i >= 0; i--) {
                reel.calculate(reel.scrollers[i]);
            }
        } else {
            return;
        }
    };


    /* 

    ## calculate **function**

    */

    reel.calculate = function(scroller) {

        var scrollDiff = scroller.fromPos - scroller.toPos,
            scrollAmount = reel.scroll - scroller.fromPos,
            propertyDiff = scroller.fromStyle - scroller.toStyle,
            unit = propertyDiff / scrollDiff,
            animateFrom = scroller.element.style[scroller.type.property] || 0,
            animateTo = unit * scrollAmount;

        if (animateTo === scroller.toStyle || animateTo === scroller.fromStyle) {
            return;
        } else if (animateTo > scroller.toStyle) {
            reel.animate(scroller.element, scroller.type, animateFrom, scroller.toStyle);
        } else if (animateTo < scroller.fromStyle) {
            reel.animate(scroller.element, scroller.type, animateFrom, scroller.fromStyle);
        } else {
            reel.animate(scroller.element, scroller.type, animateFrom, animateTo);
        }
    };


    /* 

    ## animate **function**

    pass the 

    */

    reel.animate = function(element, property, from, to) {

        reel.property[property].update(element, to);
    };


    /* 

    ## addReel **function**

    Add a new reel to the list of reels already being updated. 
    The reels are individual property updates on elements.

    */


    reel.addReel = function(name, element, fromPos, toPos, type, fromStyle, toStyle) {

        reel.scrollers.push({
            name: name,
            element: element,
            fromPos: fromPos,
            toPos: toPos,
            type: type,
            fromStyle: fromStyle,
            toStyle: toStyle
        });

    };


    /* 

    ## removeReel **function**

        Use this function to remove reels from the update cycle.
        Using the name you bound them to at the start. 

    */

    reel.removeReel = function(name) {

    };


    /* 

    ## remove property **object**

    Object function to update individual properties.

    */

    reel.property = {
        opacity: {
            property: 'opacity',
            update: function(element, value) {
                element.style.opacity = value;
            }
        },
        rotate: {
            property: 'transform',
            update: function(element, value) {
                var re = /rotate\([-\d\d]+deg\)/g;
                element.style.transform = 'rotate(' + value + 'deg)';
                element.style.webkitTransform = 'rotate(' + value + 'deg)';
            }
        }
    };


    /* 

    ## Request animation polyfill

        Use this to get all vendor prefixes and fallbacks sorted.

    */

    (function() {
        var lastTime = 0;
        var vendors = ['ms', 'moz', 'webkit', 'o'];
        for (var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
            window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
            window.cancelAnimationFrame = window[vendors[x] + 'CancelAnimationFrame'] || window[vendors[x] + 'CancelRequestAnimationFrame'];
        }

        if (!window.requestAnimationFrame)
            window.requestAnimationFrame = function(callback, element) {
                var currTime = new Date().getTime();
                var timeToCall = Math.max(0, 16 - (currTime - lastTime));
                var id = window.setTimeout(function() {
                        callback(currTime + timeToCall);
                    },
                    timeToCall);
                lastTime = currTime + timeToCall;
                return id;
            };

        if (!window.cancelAnimationFrame)
            window.cancelAnimationFrame = function(id) {
                clearTimeout(id);
            };
    }());


    module.exports = reel;

}(window, document));