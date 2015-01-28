var Marionette = require('backbone.marionette'),
    _ = require('underscore');

var SlideDetail = Marionette.ItemView.extend({
    template: _.template('<img src="<%= img %>" width="<%= width %>" height="<%= height %>"><span><%= desc %></span>')
});

module.exports = SlideDetail;
