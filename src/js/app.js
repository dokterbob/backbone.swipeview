'use strict';

// Setup Backbone with jQuery
require('backbone-jquery');

var slides = require('./collections/slides'),
    SlideList = require('./views/slidelist');

// Set $ on Backbone


// Disable scrolling by default
document.addEventListener(
    'touchmove', function (e) { e.preventDefault(); }, false
);

var slide_list = new SlideList({
    id: 'wrapper',
    collection: slides
});
