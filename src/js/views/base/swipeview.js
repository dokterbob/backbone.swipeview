(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['backbone', 'swipeview', 'underscore', 'jquery'], factory);
    } else if (typeof exports === 'object') {
        // Node. Does not work with strict CommonJS, but
        // only CommonJS-like environments that support module.exports,
        // like Node.
        module.exports = factory(require('backbone'), require('swipeview'), require('underscore'), require('jquery'));
    } else {
        // Browser globals (root is window)
        root.returnExports = factory(root.Backbone, root.SwipeView, root._, root.$);
    }
}(this, function (Backbone, SwipeView, _, $) {
    /* A mixin which loads the SwipeView class and keeps 3 subviews in memory. */

    // Example:

    // PageView = Backbone.View.extend(_.extend({}, SwipeViewMixin, {
    //     id: 'sv-wrapper',
    //     subview: PageDetail
    // }));

    // page_view = new PageView({
    //     collection: my_collection
    // });

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
        current_subview: function() {
            // Return currently active subview
            return this.subViews[this.carousel.currentMasterPage];
        },

        goTo: function(model) {
            // Navigate to a particular model

            var index = this.collection.indexOf(model);
            if (index >= 0) {
                this.carousel.goToPage(index);

                // Update the view's model
                this.model = model;
            }
        },

        nextPage: function() {
            // Navigate to next page
            this.carousel.next();
        },

        previousPage: function() {
            // Navigate to previous page
            this.carousel.prev();
        },

        render: function(options) {
            // Render SwipeView

            console.assert(this.el);
            console.assert(this.collection);

            var appview = this;

            this.carousel = new RestorableSwipeView(this.el, {
                numberOfPages: this.collection.size(),
                loop: false,
                hastyPageFlip: true
            });

            // A list of all the views which are initialized and loaded
            // into the Swipeview.
            this.subViews = [null, null, null];

            // Load initial data
            for (var i=0; i<3; i++) {
                var page = i===0 ? appview.collection.size()-1 : i-1;
                var master_page = $(this.carousel.masterPages[i]);

                var view = this.render_subview(page, options);
                master_page.append(view.el);

                this.subViews[i] = view;
            }

            // Log events for debug purposes
            // Nice hook to handle some UX
            this.on('page_changed', function (pageindex) {
                console.log('Page change to: '+pageindex);
                // This is a hackish solution for disabling next- and previous buttons
                // Its to give our users a clue that they reached the start or end of a collection
                 if (pageindex === 0) {
                    // Disable previousbutton
                    $('.prevbutton').css({'opacity':0.5});
                } else {
                    $('.prevbutton').css({'opacity':1});
                }
                if (pageindex === appview.collection.size()-1) {
                    // Disable next nextbutton
                    $('.nextbutton').css({'opacity':0.5});
                } else {
                    $('.nextbutton').css({'opacity':1});
                }
            });

            // Callback for page changes
            this.carousel.onFlip($.proxy(function () {
                var i;
                for (i=0; i<3; i++) {
                    var master_page = appview.carousel.masterPages[i];
                    var upcoming_idx = master_page.dataset.upcomingPageIndex;

                    // Determine whether we should actually render a new page
                    if (upcoming_idx !== master_page.dataset.pageIndex) {
                        // Remove the old view.
                        var old_view = appview.subViews[i];
                        console.log('Deleting old view for: '+old_view.model.id);
                        old_view.remove();
                        old_view = null;

                        var view = this.render_subview(upcoming_idx, options);
                        $(master_page).append(view.el);

                        // Store subview for later reference
                        appview.subViews[i] = view;

                    }
                }

                // Trigger page changed event on main view
                var current_subview = appview.current_subview();
                if (current_subview) {
                    current_subview.trigger('activated');
                }

                appview.trigger('page_changed', appview.carousel.pageIndex);
            }, this));

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

            Backbone.view.prototype.remove.call(this);
        },

        render_subview: function(page_index) {
            // Instantiate a new subview for this page.

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
