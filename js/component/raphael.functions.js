/**
 * @blog       http://terryyoung.blogspot.com/2011/08/bounding-containers-in-raphaeljs.html
 */


///////////////////////////////////////////////////////////////////////////////
// Please scroll to the bottom to look at the usage code of this demo.
// These below are some core extensions to RaphaelJS that makes it all happen.


/**
 * Simplifies something like this:
 *
 * this.ox = this.type == 'rect' ? this.attr('x') : this.attr('cx');
 * this.oy = this.type == 'rect' ? this.attr('y') : this.attr('cy');
 *
 * to this:
 *
 * el.o();    // and better, it supports chaining
 *
 * @copyright   Terry Young <terryyounghk [at] gmail.com>
 * @license     WTFPL Version 2 ( http://en.wikipedia.org/wiki/WTFPL )
 */
 Raphael.el.is = function (type) { 
 	return this.type == (''+type).toLowerCase(); 
 };
 Raphael.el.isNot = function (type) { 
 	return this.type != (''+type).toLowerCase(); 
 };
 Raphael.el.x = function () { 
 	return this.is('circle') ? this.attr('cx') : this.attr('x'); 
 };
 Raphael.el.y = function () { 
 	return this.is('circle') ? this.attr('cy') : this.attr('y'); 
 };
 Raphael.el.o = function () { 
 	this.ox = this.x(); this.oy = this.y(); return this; 
 };


/**
 * getABox() for RaphaelJS - getBBox() On Steroids
 * More routine, pre-calculated values that getBBox() doesn't provide
 *
 * @author      Terry Young <terryyounghk [at] gmail.com>
 * @license     WTFPL Version 2 ( http://en.wikipedia.org/wiki/WTFPL )
 */
 Raphael.el.getABox = function ()
 {
    var b = this.getBBox(); // thanks, I'll take it from here...

    var o =
    {
        // we'd still return what the original getBBox() provides us with
        x:              b.x,
        y:              b.y,
        width:          b.width,
        height:         b.height,

        // three different x coordinates: left edge, centered, and right edge
        xLeft:          b.x,
        xCenter:        b.x + b.width / 2,
        xRight:         b.x + b.width,


        // three different y coordinates: top edge, middle, and bottom edge
        yTop:           b.y,
        yMiddle:        b.y + b.height / 2,
        yBottom:        b.y + b.height
    };


    // now we can produce a 3x3 combination of the above to derive 9 x,y coordinates

    // center
    o.center      = {x: o.xCenter,    y: o.yMiddle };

    // corners
    o.topLeft     = {x: o.xLeft,      y: o.yTop };
    o.topRight    = {x: o.xRight,     y: o.yTop };
    o.bottomLeft  = {x: o.xLeft,      y: o.yBottom };
    o.bottomRight = {x: o.xRight,     y: o.yBottom };

    // edges
    o.top         = {x: o.xCenter,    y: o.yTop };
    o.bottom      = {x: o.xCenter,    y: o.yBottom };
    o.left        = {x: o.xLeft,      y: o.yMiddle };
    o.right       = {x: o.xRight,     y: o.yMiddle };

    // shortcuts to get the offset of paper's canvas
    o.offset      = $(this.paper.canvas).parent().offset();

    return o;
};


/**
 * Create or extend the Raphael.fn.vis namespace, which is where my static extensions are located
 *
 * @author      Terry Young <terryyounghk [at] gmail.com>
 * @license     WTFPL Version 2 ( http://en.wikipedia.org/wiki/WTFPL )
 */
 Raphael.fn.vis = $.extend(true, Raphael.fn.vis || {}, {


/**
 * Small utility extension to get any random coordinate within the canvas area
 *
 * @author      Terry Young <terryyounghk [at] gmail.com>
 * @license     WTFPL Version 2 ( http://en.wikipedia.org/wiki/WTFPL )
 */
 getRandomPos: function (element, margin)
 {
 	margin = margin ? margin : 5;

 	var o = {width: 0, height: 0};

 	o = $.extend(true, element.getBBox() || {});

 	var x = Math.max(margin, Math.floor(Math.random() * (this.width - margin - o.width))),
 	y = Math.max(margin, Math.floor(Math.random() * (this.height - margin - o.height)));

 	return {x: x, y: y};
 },


/**
 * Small utility extension to get any random coordinates within the canvas area
 *
 * @author      Terry Young <terryyounghk [at] gmail.com>
 * @access      public
 */
 getCBox: function (elements, options)
 {
 	var a = elements,
 	defaults =
 	{
 		padding:    5
 	},
 	opts = $.extend(true, defaults, options || {}),
 	o =
 	{
 		x: this.width,
 		y: this.height,
 		xRight: 0,
 		yBottom: 0
 	};


 	for (var i = 0, j = a.length; i < j; i++)
 	{
 		var b = a[i].getABox();

 		o =
 		{
 			x:          Math.min(o.x,       b.left.x - opts.padding),
 			y:          Math.min(o.y,       b.top.y - opts.padding),
 			xLeft:      Math.min(o.x,       b.left.x - opts.padding),
 			yTop:       Math.min(o.y,       b.top.y - opts.padding),
 			xRight:     Math.max(o.xRight,  b.right.x + opts.padding),
 			yBottom:    Math.max(o.yBottom, b.bottom.y + opts.padding)
 		};
 	}

 	o.width     = Math.abs(o.xRight - o.xLeft);
 	o.height    = Math.abs(o.yBottom - o.yTop);

 	o.xCenter   = o.x + o.width / 2;
 	o.yMiddle   = o.y + o.height / 2;

    // center
    o.center      = {x: o.xCenter,    y: o.yMiddle };

    // corners
    o.topLeft     = {x: o.xLeft,      y: o.yTop };
    o.topRight    = {x: o.xRight,     y: o.yTop };
    o.bottomLeft  = {x: o.xLeft,      y: o.yBottom };
    o.bottomRight = {x: o.xRight,     y: o.yBottom };

    // edges
    o.top         = {x: o.xCenter,    y: o.yTop };
    o.bottom      = {x: o.xCenter,    y: o.yBottom };
    o.left        = {x: o.xLeft,      y: o.yMiddle };
    o.right       = {x: o.xRight,     y: o.yMiddle };


    return o;
}


}); // End Raphael.fn.vis




/**
 * Routine method, so that you can just do this.drag(move, start, end);
 *
 * @author      Terry Young <terryyounghk [at] gmail.com>
 * @license     WTFPL Version 2 ( http://en.wikipedia.org/wiki/WTFPL )
 */
 Raphael.el.draggable = function (options)
 {
 	$.extend(true, this, {
        margin: 0               // I might expand this in the future
    }, options || {margin: 10});

 	var start = function () {
            this.o().toFront(); // store original pos, and zIndex to top

            if (this.dots && this.drawDots)
            {
            	this.drawDots();
            }
        },
        move = function (dx, dy, mx, my, ev) {
            var b = this.getABox(); // Raphael's getBBox() on steroids
            var px = mx - b.offset.left,
            py = my - b.offset.top,
            x = this.ox + dx,
            y = this.oy + dy,
            r = this.is('circle') ? b.width / 2 : 0;

            var x = Math.min(
            	Math.max(0 + this.margin + (this.is('circle') ? r : 0), x),
            	this.paper.width - (this.is('circle') ? r : b.width) - this.margin),
            y = Math.min(
            	Math.max(0 + this.margin + (this.is('circle') ? r : 0), y),
            	this.paper.height - (this.is('circle') ? r : b.height) - this.margin);

            var pos = { x: x, y: y, cx: x, cy: y };

            this.attr(pos);

            if (this.dots && this.drawDots)
            {
            	this.drawDots();
            }
        },
        end = function () {
        };

        this.drag(move, start, end);

    return this; // chaining
};


/**
 * Makes Raphael.el.draggable applicable to Raphael Sets, and chainable
 *
 * @author      Terry Young <terryyounghk [at] gmail.com>
 * @license     WTFPL Version 2 ( http://en.wikipedia.org/wiki/WTFPL )
 */
 Raphael.st.draggable = function (options) { 
 	for (var i in this.items) this.items[i].draggable(options); return this; 
 };



/**
 * This is a custom function for Raphael elements, and is designed
 * to be used with properties added and defined in Raphael.styles
 *
 * @author      Terry Young <terryyounghk [at] gmail.com>
 * @license     WTFPL Version 2 ( http://en.wikipedia.org/wiki/WTFPL )
 */
 Raphael.el.style = function (state, style, aniOptions)
 {
 	if (!this.class)
 	{
 		this.class = style ? style : 'default';
 		this.aniOptions = aniOptions ? aniOptions : null;

        // start assigning some basic behaviors
        this.mouseover(function () { this.style('hover'); });
        this.mouseout(function () { this.style('base'); });
        this.mousedown(function () { this.style('mousedown'); });
        this.click(function () { this.style('hover'); });
    }

    if (typeof style != 'undefined') this.class = style;
    if (typeof aniOptions != 'undefined') this.aniOptions = aniOptions;

    style = this.class ? this.class : style;
    state = state ? state : 'base';
    aniOptions = this.aniOptions ? this.aniOptions : null;


    // The structure of Raphael.styles is " type --> style --> state "
    if (aniOptions)
    {
    	this.animate(
    		Raphael.styles[this.type][style][state],
    		aniOptions.duration,
    		aniOptions.easing,
    		function () {
    			if (aniOptions.callback)
    			{
    				aniOptions.callback()
    			}

                // do it again without the animation, to apply attributes that can't be animated, such as cursor, etc.
                this.attr(Raphael.styles[this.type][style][state]);
            });
    }
    else
    {
    	this.attr(Raphael.styles[this.type][style][state]);
    }

return this; // chaining, e.g. shape.attr({ stroke: '#fff'}).style('dragging').toFront();
};


/**
 * Same API as Raphael.el.style for Raphael Sets
 *
 * @author      Terry Young <terryyounghk [at] gmail.com>
 * @license     WTFPL Version 2 ( http://en.wikipedia.org/wiki/WTFPL )
 */
 Raphael.st.style = function (state, style, animated)
 {
 	for (var i = 0, j = this.items.length; i < j; i++)
 	{
 		var item = this.items[i];
 		item.style(state, style, animated);
 	}

return this; // chaining, e.g. set.attr({ stroke: '#fff'}).style('dragging').toFront();
};


/**
 * This is a method to add more style sets at runtime
 *
 * @author      Terry Young <terryyounghk [at] gmail.com>
 * @license     WTFPL Version 2 ( http://en.wikipedia.org/wiki/WTFPL )
 */
 Raphael.setStyles = function (styles)
 {
 	Raphael.styles = $.extend(true, {}, styles);
 };


 Raphael.setStyles
 (
 {
 	rect:
 	{
        // base:        base style of a shape (For on/off states, "base" is the "off" state)
        // dragging:    style when this shape is being dragged
        // hover:       style when this line is directly hovered (previous state will be stored to prev)
        // mousedown:   style when mousedown onto this line (mouseup restores to hover style)

            // you can add your own set of visual states
            'default':
            {
            	base:
            	{
            		opacity:        1,
            		fill:           '#dddddd',
            		stroke:         '#aaaaaa',
            		'stroke-width': 1
            	},
            	dragging:
            	{
            		opacity:        1,
            		fill:           '#f07171',
            		stroke:         '#e92c2c'
            	},
            	related:
            	{
            		opacity:        1,
            		fill:           '#d2eaf2',
            		stroke:         '#85c7dc'
            	},
            	hover:
            	{
            		opacity:        1,
            		cursor:         'pointer',
            		stroke:         '#6a8fc8',
            		fill:           '#b6c8e4'
            	},
            	mousedown:
            	{
            		opacity:        1,
            		fill:           '#a3badc',
            		stroke:         '#7597ca'
            	}
            }
        },
        image:
        {
            // you can add your own set of visual states
            'default':
            {
            	base:       { cursor: 'pointer', opacity: 1 },
            	dragging:   { cursor: 'pointer', opacity: 0.3 },
            	hover:      { cursor: 'pointer', opacity: 0.7 },
            	mousedown:  { cursor: 'pointer', opacity: 0.6 }
            }
        },
        text:
        {
            // you can add your own set of visual states
            'default':
            {
            	base:
            	{
            		cursor:         'pointer',
            		'text-anchor':  'start',
            		fill:           'darkblue'
            	},
            	dragging:
            	{
            		cursor:         'pointer',
            		fill:           'pink'
            	},
            	hover:
            	{
            		cursor:         'pointer',
            		fill:           'red'
            	},
            	mousedown:
            	{
            		cursor:         'pointer',
            		fill:           'darkred'
            	}
            }
        },
        circle:
        {
        	'connectorDots':
        	{
        		'base':
        		{
                    r:              4,      // fixed radius
                    cursor:         'pointer',
                    fill:           '#fff',
                    stroke:         '#000',
                    'stroke-width': 1,
                    opacity:        0
                },
                'show':
                {
                	cursor:         'pointer',
                	opacity:        1
                },
                'hover':
                {
                	cursor:         'pointer',
                	r:              8,
                	fill:         '#ffff00',
                	opacity:        1
                },
                mousedown:
                {
                	cursor:         'pointer',
                	fill:         '#e8bc62'
                }
            }
        }
    }
    );


/**
 * This creates and refreshes possible connector points for rects and circles.
 * This is just a prototype.
 *
 * @author      Terry Young <terryyounghk [at] gmail.com>
 * @license     WTFPL Version 2 ( http://en.wikipedia.org/wiki/WTFPL )
 */
 Raphael.el.drawDots = function (aniOptions)
 {
    var o = this.getABox(); // This is the getBBox() on steroids

    if (!this.dots)
    {
        console.log("!docs");
        // default animation options. If you don't want animation, pass in null
        this.aniOptions = aniOptions ? aniOptions : {
        	duration:       300,
        	easing:         'backOut'
        };

        var c = {
        	set: this.paper.set()
        };

        c.set.push(c.top           = this.paper.circle(1, 1, 3).attr({cx: o.top.x, cy: o.top.y}));
        c.set.push(c.left          = this.paper.circle(1, 1, 3).attr({cx: o.left.x, cy: o.left.y}));
        c.set.push(c.right         = this.paper.circle(1, 1, 3).attr({cx: o.right.x, cy: o.right.y}));
        c.set.push(c.bottom        = this.paper.circle(1, 1, 3).attr({cx: o.bottom.x, cy: o.bottom.y}));
        

        if (this.is('circle') == false)
        {
        	c.set.push(c.topLeft       = this.paper.circle(1, 1, 3).attr({cx: o.topLeft.x, cy: o.topLeft.y}));
        	c.set.push(c.topRight      = this.paper.circle(1, 1, 3).attr({cx: o.topRight.x, cy: o.topRight.y}));
        	c.set.push(c.bottomLeft    = this.paper.circle(1, 1, 3).attr({cx: o.bottomLeft.x, cy: o.bottomLeft.y}));
        	c.set.push(c.bottomRight   = this.paper.circle(1, 1, 3).attr({cx: o.bottomRight.x, cy: o.bottomRight.y}));
        }


        // cyclic references
        // c.top.set =
        // c.left.set =
        // c.right.set =
        // c.bottom.set =        c.set;

        if (this.is('circle') == false)
        {
        	c.topLeft.set =
        	c.topRight.set =
        	c.bottomLeft.set =
        	c.bottomRight.set =   c.set;
        }

        c.set
        .hide()
        .style('base', 'connectorDots', this.aniOptions) // Behold the power of .style()
        .toFront();


        this
        .mouseover(function () { c.set.show().style('show'); })
        .mouseout(function () { c.set.style('base'); })
        .drag(
        	function () { c.set.hide(); },
        	function () { c.set.hide(); },
        	function () { c.set.show()}
        	);

        c.set
        .mouseover(function () { this.set.style('show'); })
        .mouseout(function () { this.set.style('base'); });


    this.dots = c; // looks readible in Firebug
}
else
{
    console.log("docs");
	var c = this.dots;

	aniOptions = this.aniOptions ? this.aniOptions : null;

	// c.top         .attr({cx: o.top.x,             cy: o.top.y});
	// c.left        .attr({cx: o.left.x,            cy: o.left.y});
	// c.right       .attr({cx: o.right.x,           cy: o.right.y});
	// c.bottom      .attr({cx: o.bottom.x,          cy: o.bottom.y});

	if (this.is('circle') == false)
	{
		c.topLeft     .attr({cx: o.topLeft.x,         cy: o.topLeft.y});
		c.topRight    .attr({cx: o.topRight.x,        cy: o.topRight.y});
		c.bottomLeft  .attr({cx: o.bottomLeft.x,      cy: o.bottomLeft.y});
		c.bottomRight .attr({cx: o.bottomRight.x,     cy: o.bottomRight.y});
	}

        c.set.toFront(); // Bam!
    }

    return this; // chaining
};

/**
 *
 * Makes Raphael.el.drawDots applicable to Raphael Sets, and chainable
 *
 * @author      Terry Young <terryyounghk [at] gmail.com>
 * @license     WTFPL Version 2 ( http://en.wikipedia.org/wiki/WTFPL )
 *
 */
//  Raphael.st.drawDots = function (aniOptions)
//  {
//     console.log(aniOptions);
//     console.log(this.items);
//  	for (var i = 0, j = this.items.length; i < j; i++)
//  	{
//  		this.items[i].drawDots(aniOptions);
//         console.log(i);
//         console.log(this.items[i]);
//  	}

//     return this; // chaining
// }

/**
 * Bounding Containers in RaphaelJS: DEMO
 *
 * @blog        http://terryyoung.blogspot.com/2011/08/bounding-containers-in-raphaeljs.html
 * @copyright   Terry Young <terryyounghk [at] gmail.com>
 * @license     WTFPL Version 2 ( http://en.wikipedia.org/wiki/WTFPL )
 */

///////////////////////////////////////////////////////////////////////////////
// The demo
// $(document).ready(function () {
//     // Prepare the paper and elements
//     var paper   = Raphael('SVG_GETCBOX_1', 640, 200),
//     set     = paper.set(),
//     rect    = paper.rect(paper.width / 2, -100, 32, 32, 5),
//         image   = paper.image('about:blank', paper.width / 2, -100, 32, 32), // real src is defined in styles
//         label   = paper.text(paper.width / 2, -100, 'My Computer'),
//         margin  = 20,
//         loop    = false;

//         set.push(rect, image, label).style();


//     // This will be the element appearing as a container of the above three objects
//     var container = paper.rect(paper.width / 2, -150, 1, 1, 5)
//     .attr({opacity: 0.7, fill: '#bed9ae', stroke: '#476442', 'stroke-width': 4})
//     .drawDots()
//     .toBack()
//     .mouseover(this.toBack)
//     .mouseout(this.toBack);

//     // function to resize the bounding container
//     var resizeContainer = function () {
//         container.dots.set.hide(); // hide dots while resizing

//         // This is the magic function.
//         // Pass in as many RaphaelJS elements as an array,
//         // and you'll get all the useful coordinates and dimensions of the resulting container

//         var o = paper.vis.getCBox(set.items);

//         // reposition and resize
//         container.stop().animate({x: o.x, y: o.y, width: o.width, height: o.height, opacity: 0.7}, 800, 'backOut', function ()
//         {
//             this.drawDots();
//             this.dots.set.show();
//             if (loop) setTimeout(demoGetCBox, 500);
//         });
//     };

//     // function randomize positions of small elements, then resize the bounding container
//     var demoGetCBox = function () {

//         container.dots.set.hide();
//         container.stop().animate({opacity: 0.2}, 1000, 'backOut', function ()
//         {
//             container.dots.set.hide();

//             var pos = paper.vis.getRandomPos(rect, margin);
//             rect.stop().animate({x: pos.x, y: pos.y}, 800, 'backOut');

//             var pos = paper.vis.getRandomPos(image, margin);
//             image.stop().animate({x: pos.x, y: pos.y}, 1200, 'backOut');

//             var pos = paper.vis.getRandomPos(label, margin);
//             label.stop().animate({x: pos.x, y: pos.y}, 1500, 'backOut', function ()
//             {
//                 resizeContainer();
//             });
//         });
//     };

//     // to resize the bounding container while dragging the small elements
    
//     set.draggable().drag(
//         function ()
//         {
//             loop = false;
//             resizeContainer();
//         },
//         function () {
//             // not cool
//         },
//         function ()
//         {
//             loop = false;
//             resizeContainer();
//         });

//     // or you can click those buttons to randomly position elements and resize the bounding container
    
//     $('#SVG_GETCBOX_MANUAL').click(function () { loop = false; demoGetCBox(); });
//     $('#SVG_GETCBOX_AUTO').click(function () { loop = true; demoGetCBox(); });

//     demoGetCBox(); // run once the first time
// });









