(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['backbone', 'swipeview', 'underscore'], factory);
    } else if (typeof exports === 'object') {
        // Node. Does not work with strict CommonJS, but
        // only CommonJS-like environments that support module.exports,
        // like Node.
        module.exports = factory(require('backbone'), require('swipeview'), require('underscore'));
    } else {
        // Browser globals (root is window)
        root.returnExports = factory(root.Backbone, root.SwipeView, root._);
    }
}(this, function (Backbone, SwipeView, _) {
    /* A mixin which loads the SwipeView class and keeps 3 subviews in memory. */

    'use strict';
    /* XXX: This also adds the 'restore' and 'destroy' methods to the SwipeView
     * "class". While the intend was to create a new "class" with the old
     * Swipeview methods plus the new methods below.
     *
     * An example of how to do this can be found in the Backbone extend()
     * function. Not to be confused with the underscore extend function.
     */
    var RestorableSwipeView = (function () {
        var hasTouch = 'ontouchstart' in window,
            resizeEvent = 'onorientationchange' in window ? 'orientationchange' : 'resize',
            startEvent = hasTouch ? 'touchstart' : 'mousedown',
            moveEvent = hasTouch ? 'touchmove' : 'mousemove',
            endEvent = hasTouch ? 'touchend' : 'mouseup';

        SwipeView.prototype.restore = function () {
                var i, l;
                for (i=0, l=this.customEvents.length; i<l; i++) {
                    this.wrapper.addEventListener('swipeview-' + this.customEvents[i][0], this.customEvents[i][1], false);
                }

                window.addEventListener(resizeEvent, this, false);
                this.wrapper.addEventListener(startEvent, this, false);
                this.wrapper.addEventListener(moveEvent, this, false);
                this.wrapper.addEventListener(endEvent, this, false);
                this.slider.addEventListener('webkitTransitionEnd', this, false);

                console.log('Swipeview is active');
        };

        SwipeView.prototype.destroy = function () {
                var i, l;
                for (i=0, l=this.customEvents.length; i<l; i++) {
                    this.wrapper.removeEventListener('swipeview-' + this.customEvents[i][0], this.customEvents[i][1], false);
                }

                // Remove the event listeners
                window.removeEventListener(resizeEvent, this, false);
                this.wrapper.removeEventListener(startEvent, this, false);
                this.wrapper.removeEventListener(moveEvent, this, false);
                this.wrapper.removeEventListener(endEvent, this, false);
                this.slider.removeEventListener('webkitTransitionEnd', this, false);

                console.log('Swipeview is disabled');
        };

        return SwipeView;
    })();

    return Backbone.View.extend({
        swipeview_options: {},

        current_subview: function() {
            // Return currently active subview
            return this.subViews[this.gallery.currentMasterPage];
        },

        goTo: function(model) {
            // Navigate to a particular model

            var index = this.collection.indexOf(model);
            if (index >= 0) {
                this.gallery.goToPage(index);

                // Update the view's model
                this.model = model;

                // Trigger page_changed
                this.trigger('page_changed', index);
            }
        },

        nextPage: function() {
            // Navigate to next page
            this.gallery.next();
        },

        previousPage: function() {
            // Navigate to previous page
            this.gallery.prev();
        },

        pageCount: function() {
            // Return number of pages
            return this.collection.size();
        },

        render: function(options) {
            // Render SwipeView
            // options are passed to the subview

            console.log('Rendering SwipeView');
            console.assert(this.el);
            console.assert(this.collection);

            // Get swipeview options but make sure number of pages is set
            var swipeview_options = _.extend({}, this.swipeview_options, {
                numberOfPages: this.pageCount()
            });

            this.gallery = new RestorableSwipeView(this.el, swipeview_options);

            // A list of all the views which are initialized and loaded
            // into the Swipeview.
            this.subViews = [null, null, null];

            // Load initial data
            for (var i=0; i<3; i++) {
                var page = i===0 ? this.pageCount()-1 : i-1;
                var master_page = Backbone.$(this.gallery.masterPages[i]);

                var view = this.render_subview(page, options);
                master_page.append(view.el);

                this.subViews[i] = view;
            }

            // Log events for debug purposes
            // Nice hook to handle some UX
            this.on('page_changed', function (pageindex) {
                // console.log('Page change to: '+pageindex);

                // Trigger 'first_page' and 'last_page' signals on,
                // respectively, the first and the last page.
                if (pageindex === 0) {
                    this.trigger('first_page');
                }

                if (pageindex === this.pageCount()-1) {
                    this.trigger('last_page');
                }
            }, this);

            // Callback for page changes
            this.gallery.onFlip(Backbone.$.proxy(function () {
                var i;
                for (i=0; i<3; i++) {
                    var master_page = this.gallery.masterPages[i];
                    var upcoming_idx = master_page.dataset.upcomingPageIndex;

                    // Determine whether we should actually render a new page
                    if (upcoming_idx != "undefined" && upcoming_idx !== master_page.dataset.pageIndex) {
                        // Remove the old view.
                        var old_view = this.subViews[i];
                        // console.log('Deleting old view for: '+old_view.model.id);
                        old_view.remove();
                        old_view = null;

                        var view = this.render_subview(upcoming_idx, options);
                        Backbone.$(master_page).append(view.el);

                        // Store subview for later reference
                        this.subViews[i] = view;

                    }
                }

                // Trigger page changed event on main view
                var current_subview = this.current_subview();
                console.assert(current_subview);

                current_subview.trigger('activated');

                // It turns out the pageIndex on the gallery is not reliable
                // here, hence we use the index on the current_subview.
                var index  = this.collection.indexOf(current_subview.model);

                Backbone.$(this.gallery.slider).one('transitionend',
                    Backbone.$.proxy(function () {
                        this.trigger('page_changed', index);
                    }, this)
                );
            }, this));

            this.gallery.bind();

            // If model specified, navigate to specified page
            if (this.model) {
                this.go_to(this.model);
            }

            return this;
        },

        remove: function () {
            // Remove self and all subviews
            _.each(this.subViews, function (view) {
                view.remove();
            });
            this.subViews = [null, null, null];

            Backbone.View.prototype.remove.call(this);
        },

        render_subview: function(page_index) {
            // Instantiate a new subview for this page.
            // console.log('Rendering SwipeView page: ', page_index);

            // Request the model using the page_index from the collection.
            var obj = this.collection.at(page_index);

            // Instantiate the subview using the newly acquired model.
            var subview_instance = new this.subview({
                model: obj
            });

            // Render the fucker.
            subview_instance.render();

            return subview_instance;
        },
    });
}));
