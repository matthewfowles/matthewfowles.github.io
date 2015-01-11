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
	
	Bind event listeners to the window on scroll event.
	Also update the current scroll position of the window

    */

    reel.init = function() {

        w.addEventListener('scroll', function(e) {
            reel.getScroll();
            reel.update();
        });

        reel.getScroll();

    };


    /* 

    ## getScroll **function**

    	Get the current vertical scroll coords of the document

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

            if(animateTo === scroller.toStyle || animateTo === scroller.fromStyle) {
            	return;
            } else if (animateTo > scroller.toStyle) {
            	reel.animate(scroller.element, scroller.type, animateFrom, scroller.toStyle);
            } else if(animateTo < scroller.fromStyle) {
            	reel.animate(scroller.element, scroller.type, animateFrom, scroller.fromStyle);
            } else {
            	reel.animate(scroller.element, scroller.type, animateFrom, animateTo);
            }
    };


    /* 

    ## animate **function**

    */

    reel.animate = function(element, property, from, to) {

        	reel.property[property].update(element, to);
    };


    /* 

    ## addReel **function**

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

    */

    reel.removeReel = function(name) {

    };


    /* 

    ## removeReel **object**

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
            	
            }
        }
    };


    module.exports = reel;

}(window, document));