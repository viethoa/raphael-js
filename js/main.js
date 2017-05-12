
window.onload = function () {
    var paper = Raphael("container", "100%", "100%");
    var sidebar = paper.rect(0, 43.5, 69, 620);
    var rect = paper.rect(10, 50, 51, 41, 5).attr({stroke: '#6DAACA', 'stroke-width': 1, fill: '#D6F2FC'});
    var circle1 = paper.circle(35, 145, 25).attr({fill: '#fff', 'stroke-width': 2, stroke: '#399324'});
    var circle2 = paper.circle(35, 225, 25).attr({fill: '#fff', 'stroke-width': 4, stroke: '#9E2F3C'});
    var circle3 = paper.circle(35, 310, 25).attr({fill: '#fff', 'stroke-width': 4, stroke: '#D5C096'});
    var Customrect = paper.path("M25 370 L10 370 L10 411 L25 411 L25 370 L61 370 L61 411 L25 411");

    paper.set(circle1);

    var line;
    var clone_handler = function () {
        var x = this.clone();
        x.drag(move, start, up);
    };
    var start = function (x, y, event) {
        this.ox = this.attr("cx");
        this.oy = this.attr("cy");
        line = paper.path("M"+" "+this.ox+" "+this.oy);
    },
    move = function (dx, dy) {
        this.attr({
            cx: this.ox + dx,
            cy: this.oy + dy
        });

    },
    move2 = function () {
        line.remove();
        line = paper.path("M"+" "+this.ox+" "+this.oy+"L"+this.attr("cx")+" "+this.attr("cy")); 
    }
    up = function () {
        this.animate({
            r: 20,
            opacity: '.8',
        }, 500, ">");
        this.drag(move2, start, up);
    };
    circle1.mousemove(clone_handler);
    circle2.mousemove(clone_handler);
    circle3.mousemove(clone_handler);
};


/**
 * Bounding Containers in RaphaelJS: DEMO
 *
 * @blog        http://terryyoung.blogspot.com/2011/08/bounding-containers-in-raphaeljs.html
 * @copyright   Terry Young <terryyounghk [at] gmail.com>
 * @license     WTFPL Version 2 ( http://en.wikipedia.org/wiki/WTFPL )
 */

///////////////////////////////////////////////////////////////////////////////
// The demo
$(document).ready(function () {
    // Prepare the paper and elements
    var paper   = Raphael('SVG_GETCBOX_1', 640, 200),
    set     = paper.set(),
    rect    = paper.rect(paper.width / 2, -100, 32, 32, 5),
        image   = paper.image('about:blank', paper.width / 2, -100, 32, 32), // real src is defined in styles
        label   = paper.text(paper.width / 2, -100, 'My Computer'),
        margin  = 20,
        loop    = false;

        set.push(rect, image, label).style();


    // This will be the element appearing as a container of the above three objects

    var container = paper.rect(paper.width / 2, -150, 1, 1, 5)
    .attr({opacity: 0.7, fill: '#bed9ae', stroke: '#476442', 'stroke-width': 4})
    .drawDots()
    .toBack()
    .mouseover(this.toBack)
    .mouseout(this.toBack);

    // function to resize the bounding container
    var resizeContainer = function () {
        container.dots.set.hide(); // hide dots while resizing

        // This is the magic function.
        // Pass in as many RaphaelJS elements as an array,
        // and you'll get all the useful coordinates and dimensions of the resulting container

        var o = paper.vis.getCBox(set.items);

        // reposition and resize
        container.stop().animate({x: o.x, y: o.y, width: o.width, height: o.height, opacity: 0.7}, 800, 'backOut', function ()
        {
            this.drawDots();
            this.dots.set.show();
            if (loop) setTimeout(demoGetCBox, 500);
        });
    };

    // function randomize positions of small elements, then resize the bounding container
    var demoGetCBox = function () {

        container.dots.set.hide();
        container.stop().animate({opacity: 0.2}, 1000, 'backOut', function ()
        {
            container.dots.set.hide();

            var pos = paper.vis.getRandomPos(rect, margin);
            rect.stop().animate({x: pos.x, y: pos.y}, 800, 'backOut');

            var pos = paper.vis.getRandomPos(image, margin);
            image.stop().animate({x: pos.x, y: pos.y}, 1200, 'backOut');

            var pos = paper.vis.getRandomPos(label, margin);
            label.stop().animate({x: pos.x, y: pos.y}, 1500, 'backOut', function ()
            {
                resizeContainer();
            });
        });
    };

    // to resize the bounding container while dragging the small elements
    
    set.draggable().drag(
        function ()
        {
            loop = false;
            resizeContainer();
        },
        function () {
            // not cool
        },
        function ()
        {
            loop = false;
            resizeContainer();
        });

    // or you can click those buttons to randomly position elements and resize the bounding container
    
    $('#SVG_GETCBOX_MANUAL').click(function () { loop = false; demoGetCBox(); });
    $('#SVG_GETCBOX_AUTO').click(function () { loop = true; demoGetCBox(); });

    demoGetCBox(); // run once the first time
});