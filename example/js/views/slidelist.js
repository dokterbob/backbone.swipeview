/*
Swipeable list view of slides.

Based on SwipeView's gallery example.
*/

var SwipeView = require('../../../src/backbone.swipeview'),
    SlideDetail = require('./slidedetail');

var SlideList = SwipeView.extend({
    subview: SlideDetail,
    swipeview_options: {
        loop: false
    }
});

module.exports = SlideList;
