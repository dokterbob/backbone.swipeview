# backbone.swipeview
Backbone view wrapping (a fork of) Spinelli's SwipeView, allowing for
easily rendering collections using a manually definable subview.

## Example
Usage is as follows:

    var SlideList = SwipeView.extend({
        subview: SlideDetail,
        swipeview_options: {
            loop: true
        }
    });

    var slide_list = new SlideList({
        el: '#wrapper',
        collection: slides,
        swipeview_options: {
            loop: true
        }
    });

    slide_list.render();

### Running the example
A full usage example is supplied in the repository and can be started by
running (after cloning):

1. ``$ npm install``
2. ``$ grunt``

The example requires ``grunt`` and ``npm`` to be installed globally. If not
available they may be installed (or upgraded) by running:

1. ``npm install -g npm``
2. ``npm install -g grunt``
