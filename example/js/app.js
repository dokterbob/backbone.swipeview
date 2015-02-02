'use strict';

// Setup Backbone with jQuery
require('backbone-jquery');

var $ = require('jquery'),
    slides = require('./collections/slides'),
    SlideList = require('./views/slidelist');

// Disable scrolling by default
document.addEventListener(
    'touchmove', function (e) { e.preventDefault(); }, false
);

$(function () {
    var slide_list = new SlideList({
        el: '#wrapper',
        collection: slides
    });

    slide_list.render();
});
