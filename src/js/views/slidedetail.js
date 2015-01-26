var Marionette = require('backbone.marionette');

var SlideView = Marionette.ItemView.extend({
    template: '<img src="<%= img %>" width="<%= width %>" height="<%= height %>"><span><%= desc %></span>'
});

module.exports = SlideView;
