'use strict';

var console = require('console-browserify'),
    $ = require('jquery'),
    Backbone = require('backbone'),
    SwipeView = require('swipeview');

// Bind jQuery to Backbone
Backbone.$ = $;

// Disable scrolling by default
document.addEventListener(
    'touchmove', function (e) { e.preventDefault(); }, false
);

// Gallery example
var gallery,
    el,
    i,
    page,
    dots = document.querySelectorAll('#nav li'),
    slides = [
        {
            img: 'images/pic01.jpg',
            width: 300,
            height: 213,
            desc: 'Piazza del Duomo, Florence, Italy'
        },
        {
            img: 'images/pic02.jpg',
            width: 300,
            height: 164,
            desc: 'Tuscan Landscape'
        },
        {
            img: 'images/pic03.jpg',
            width: 300,
            height: 213,
            desc: 'Colosseo, Rome, Italy'
        },
        {
            img: 'images/pic04.jpg',
            width: 147,
            height: 220,
            desc: 'Somewhere near Chinatown, San Francisco'
        },
        {
            img: 'images/pic05.jpg',
            width: 300,
            height: 213,
            desc: 'Medieval guard tower, Asciano, Siena, Italy'
        },
        {
            img: 'images/pic06.jpg',
            width: 165,
            height: 220,
            desc: 'Leaning tower, Pisa, Italy'
        }
    ];

function generate_page(el, page) {
    el.className = 'loading';
    el.src = slides[page].img;
    el.width = slides[page].width;
    el.height = slides[page].height;
}

gallery = new SwipeView('#wrapper', { numberOfPages: slides.length });
gallery.bind();
// Load initial data
for (i=0; i<3; i++) {
    page = i===0 ? slides.length-1 : i-1;
    el = document.createElement('img');
    generate_page(el, page);
    el.onload = function () { this.className = ''; };

  // fixes for IE
  el.setAttribute("unselectable", "on");
  el.ondragstart = function() { return false; };

    gallery.masterPages[i].appendChild(el);
    el = document.createElement('span');
    el.innerHTML = slides[page].desc;
    gallery.masterPages[i].appendChild(el);
}
gallery.onFlip(function () {
    var el,
        upcoming,
        i;
    for (i=0; i<3; i++) {
        upcoming = gallery.masterPages[i].dataset.upcomingPageIndex;
        if (upcoming != gallery.masterPages[i].dataset.pageIndex) {
            el = gallery.masterPages[i].querySelector('img');
            generate_page(el, upcoming);

            el = gallery.masterPages[i].querySelector('span');
            el.innerHTML = slides[upcoming].desc;
        }
    }

    document.querySelector('#nav .selected').className = '';
    dots[gallery.pageIndex+1].className = 'selected';
});
gallery.onMoveOut(function () {
    gallery.masterPages[gallery.currentMasterPage].className = gallery.masterPages[gallery.currentMasterPage].className.replace(/(^|\s)swipeview-active(\s|$)/, '');
});
gallery.onMoveIn(function () {
    var className = gallery.masterPages[gallery.currentMasterPage].className;
    /(^|\s)swipeview-active(\s|$)/.test(className) || (gallery.masterPages[gallery.currentMasterPage].className = !className ? 'swipeview-active' : className + ' swipeview-active'); // jshint ignore:line
});
