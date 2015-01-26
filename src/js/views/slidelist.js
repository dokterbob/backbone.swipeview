/* Swipeable list view of slides. */

var SwipeView = require('./base/swipeview'),
    SlideDetail = require('./slidedetail');

var SlideList = SwipeView.extend({
    subview: SlideDetail
});

module.exports = SlideList;
