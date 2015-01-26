/* Swipeable list view of slides. */

var SwipeView = require('./base/swipeview'),
    SlideDetail = require('./slidedetail');

var SlideList = SwipeView.extend({
    id: 'wrapper',
    subview: SlideDetail
});

module.exports = SlideList;
