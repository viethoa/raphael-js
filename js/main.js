
window.onload = function () {
    var paper = new Raphael(Raphael("container", "100%", "100%"));
    var sidebar = paper.rect(0, 43.5, 69, 620);
    var rect = paper.rect(10, 50, 51, 41, 5).attr({stroke: '#6DAACA', 'stroke-width': 1, fill: '#D6F2FC'});
    var circle1 = paper.circle(35, 145, 25).attr({fill: '#fff', 'stroke-width': 2, stroke: '#399324'});
    var circle2 = paper.circle(35, 225, 25).attr({fill: '#fff', 'stroke-width': 4, stroke: '#9E2F3C'});
    var circle3 = paper.circle(35, 310, 25).attr({fill: '#fff', 'stroke-width': 4, stroke: '#D5C096'});
    var Customrect = paper.path("M25 370 L10 370 L10 411 L25 411 L25 370 L61 370 L61 411 L25 411");

    paper.set(circle1);

    var line;
    var clone_handler = function () {
        var circle = this.clone();
        circle.drag(move, start, up);
        circle.drawDots();
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
    // move2 = function () {
    //     line.remove();
    //     line = paper.path("M"+" "+this.ox+" "+this.oy+"L"+this.attr("cx")+" "+this.attr("cy")); 
    // }
    up = function () {
        this.animate({
            r: 20,
            opacity: '.8',
        }, 500, ">");
    };
    circle1.mousemove(clone_handler);
    circle2.mousemove(clone_handler);
    circle3.mousemove(clone_handler);
};
