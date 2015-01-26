var Backbone = require('backbone');

var slides = new Backbone.Collection([
    {
        img: 'images/pic01.jpg',
        width: 300,
        height: 213,
        desc: 'Piazza del Duomo, Florence, Italy'
    },
    {
        img: 'images/pic02.jpg',
        width: 300,
        height: 164,
        desc: 'Tuscan Landscape'
    },
    {
        img: 'images/pic03.jpg',
        width: 300,
        height: 213,
        desc: 'Colosseo, Rome, Italy'
    },
    {
        img: 'images/pic04.jpg',
        width: 147,
        height: 220,
        desc: 'Somewhere near Chinatown, San Francisco'
    },
    {
        img: 'images/pic05.jpg',
        width: 300,
        height: 213,
        desc: 'Medieval guard tower, Asciano, Siena, Italy'
    },
    {
        img: 'images/pic06.jpg',
        width: 165,
        height: 220,
        desc: 'Leaning tower, Pisa, Italy'
    }
]);

module.exports = slides;
