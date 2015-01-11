hljs = require('../../node_modules/highlight.js/lib/highlight.js');
hljs.registerLanguage('xml', require('../../node_modules/highlight.js/lib/languages/xml'));
hljs.registerLanguage('bash', require('../../node_modules/highlight.js/lib/languages/bash'));
hljs.registerLanguage('css', require('../../node_modules/highlight.js/lib/languages/css'));
hljs.registerLanguage('markdown', require('../../node_modules/highlight.js/lib/languages/markdown'));
hljs.registerLanguage('handlebars', require('../../node_modules/highlight.js/lib/languages/handlebars'));
hljs.registerLanguage('javascript', require('../../node_modules/highlight.js/lib/languages/javascript'));
hljs.registerLanguage('json', require('../../node_modules/highlight.js/lib/languages/json'));
hljs.registerLanguage('scss', require('../../node_modules/highlight.js/lib/languages/scss'));


var reel = require('./modules/reel.js');

reel.init();
var dw = document.querySelectorAll('.share-component__down-arrow');
reel.addReel('opacity-arrow', dw[0], 100, 1000, 'opacity', 0, 1);
reel.addReel('opacity-rotate', dw[0], 100, 1000, 'rotate', 0, 180);

var w = window,
    d = document,
    e = d.documentElement,
    g = d.getElementsByTagName('body')[0];

var indexHeight = function() {
    var backCover = document.querySelectorAll('.js-back-cover');
    var frontCover = document.querySelectorAll('.js-front-cover');

    var x = w.innerWidth || e.clientWidth || g.clientWidth,
        y = w.innerHeight || e.clientHeight || g.clientHeight;

    if(backCover.length !== 0) {
        if(y >= frontCover[0].clientHeight) {
            backCover[0].style.height = y + 'px';
        } else {
            backCover[0].style.height = frontCover[0].clientHeight + 'px';
        }
    }
};

window.onload = function() {
    indexHeight();
    
    var code = document.querySelectorAll('code');

    for (var i = code.length - 1; i >= 0; i--) {
        hljs.highlightBlock(code[i]);
    }
};

window.onresize = function() { 
    indexHeight();
};



// first add raf shim
// http://www.paulirish.com/2011/requestanimationframe-for-smart-animating/
window.requestAnimFrame = (function() {
    return window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        function(callback) {
            window.setTimeout(callback, 1000 / 60);
        };
})();


scrollToY = function(scrollTargetY, speed, easing) {
    // scrollTargetY: the target scrollY property of the window
    // speed: time in pixels per second
    // easing: easing equation to use

    var scrollY = window.scrollY,
        currentTime = 0;

    scrollTargetY = scrollTargetY || 0;
    speed = speed || 2000;
    easing = easing || 'easeOutSine';

    // min time .1, max time .8 seconds
    var time = Math.max(0.1, Math.min(Math.abs(scrollY - scrollTargetY) / speed, 0.8));

    // easing equations from https://github.com/danro/easing-js/blob/master/easing.js
    var PI_D2 = Math.PI / 2,
        easingEquations = {
            easeOutSine: function(pos) {
                return Math.sin(pos * (Math.PI / 2));
            },
            easeInOutSine: function(pos) {
                return (-0.5 * (Math.cos(Math.PI * pos) - 1));
            },
            easeInOutQuint: function(pos) {
                if ((pos /= 0.5) < 1) {
                    return 0.5 * Math.pow(pos, 5);
                }
                return 0.5 * (Math.pow((pos - 2), 5) + 2);
            }
        };

    // add animation loop
    function tick() {
        currentTime += 1 / 60;

        var p = currentTime / time;
        var t = easingEquations[easing](p);

        if (p < 1) {
            requestAnimFrame(tick);

            window.scrollTo(0, scrollY + ((scrollTargetY - scrollY) * t));
        } else {
            window.scrollTo(0, scrollTargetY);
        }
    }

    // call it once to get started
    tick();
};


twitterShare =  function() {

	var el = document.querySelectorAll('.twitter-share');

	var url = el[0].attributes['data-url'].value || '',
		text = encodeURI(el[0].attributes['data-text'].value) || '',
		user = el[0].attributes['data-via'].value || ''; 

	var output = 'https://twitter.com/share?text=' + text + '&url=' + url + '&via=' + user;  

	window.open(output, 'Twitter', 'width=500, height=350, statusbar=no, titlebar=no, toolbar=no');
};

googleShare =  function() {

    var el = document.querySelectorAll('.google-share');

    var url = el[0].attributes['data-url'].value || '';

    var output = 'https://plus.google.com/share?url=' + url;  

    window.open(output, 'Google +', 'width=500, height=350, statusbar=no, titlebar=no, toolbar=no');
};

facebookShare =  function() {

    var el = document.querySelectorAll('.facebook-share');

    var url = el[0].attributes['data-url'].value || '';

    var output = 'http://www.facebook.com/share.php?u=' + url;  

    window.open(output, 'Facebook', 'width=500, height=350, statusbar=no, titlebar=no, toolbar=no');
};


