(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
module.exports = BboxAlignedText;

/**
 * Creates a new BboxAlignedText object - a text object that can be drawn with
 * anchor points based on a tight bounding box around the text.
 * @constructor
 * @param {object} font               p5.Font object
 * @param {string} text               String to display
 * @param {number} [fontSize=12]      Font size to use for string
 * @param {object} [pInstance=window] Reference to p5 instance, leave blank if
 *                                    sketch is global
 * @example
 * var font, bboxText;
 * function preload() {
 *     font = loadFont("./assets/Regular.ttf");
 * }
 * function setup() {
 *     createCanvas(400, 600);
 *     background(0);
 *     
 *     bboxText = new BboxAlignedText(font, "Hey!", 30);    
 *     bboxText.setRotation(PI / 4);
 *     bboxText.setAnchor(BboxAlignedText.ALIGN.CENTER, 
 *                        BboxAlignedText.BASELINE.CENTER);
 *     
 *     fill("#00A8EA");
 *     noStroke();
 *     bboxText.draw(width / 2, height / 2, true);
 * }
 */
function BboxAlignedText(font, text, fontSize, pInstance) {
    this._font = font;
    this._text = text;
    this._fontSize = (fontSize !== undefined) ? fontSize : 12;
    this.p = pInstance || window; // If instance is omitted, assume global scope
    this._rotation = 0;
    this._hAlign = BboxAlignedText.ALIGN.CENTER;
    this._vAlign = BboxAlignedText.BASELINE.CENTER;
    this._calculateMetrics(true);
}

/**
 * Vertical alignment values
 * @public
 * @static
 * @readonly
 * @enum {string}
 */
BboxAlignedText.ALIGN = {
    /** Draw from the left of the bbox */
    LEFT: "left",
    /** Draw from the center of the bbox */
    CENTER: "center",
    /** Draw from the right of the bbox */
    RIGHT: "right"
};

/**
 * Baseline alignment values
 * @public
 * @static
 * @readonly
 * @enum {string}
 */
BboxAlignedText.BASELINE = {
    /** Draw from the top of the bbox */
    BOX_TOP: "top",
    /** Draw from the center of the bbox */
    BOX_CENTER: "center",
    /** Draw from the bottom of the bbox */
    BOM_BOTTOM: "bottom",
    /** 
     * Draw from half the height of the font. Specifically the height is
     * calculated as: ascent + descent.
     */
    FONT_CENTER: "font_center",
    /** Draw from the the normal font baseline */
    ALPHABETIC: "alphabetic"
};

/**
 * Set current text
 * @public
 * @param {string} string Text string to display
 */
BboxAlignedText.prototype.setText = function(string) {
    this._text = string;
    this._calculateMetrics(false);
};

/**
 * Set current text size
 * @public
 * @param {number} fontSize Text size
 */
BboxAlignedText.prototype.setTextSize = function(fontSize) {
    this._fontSize = fontSize;
    this._calculateMetrics(true);
};

/**
 * Set rotation of text
 * @public
 * @param {number} angle Rotation in radians
 */
BboxAlignedText.prototype.setRotation = function(angle) {
    this._rotation = angle;
};

/**
 * Set anchor point for text (horizonal and vertical alignment) relative to
 * bounding box
 * @public
 * @param {string} [hAlign=CENTER] Horizonal alignment
 * @param {string} [vAlign=CENTER] Vertical baseline
 */
BboxAlignedText.prototype.setAnchor = function(hAlign, vAlign) {
    this._hAlign = hAlign || BboxAlignedText.ALIGN.CENTER;
    this._vAlign = vAlign || BboxAlignedText.BASELINE.CENTER;
};

/**
 * Get the bounding box when the text is placed at the specified coordinates.
 * Note: this is the unrotated bounding box!
 * @param  {number} x X coordinate
 * @param  {number} y Y coordinate
 * @return {object}   Returns an object with properties: x, y, w, h
 */
BboxAlignedText.prototype.getBbox = function(x, y) {
    var pos = this._calculateAlignedCoords(x, y);
    return {
        x: pos.x + this._boundsOffset.x,
        y: pos.y + this._boundsOffset.y,
        w: this.width,
        h: this.height
    };
};

/**
 * Draws the text particle with the specified style parameters
 * @public
 * @param  {number}  x                  X coordinate of text anchor
 * @param  {number}  y                  Y coordinate of text anchor
 * @param  {boolean} [drawBounds=false] Flag for drawing bounding box
 */
BboxAlignedText.prototype.draw = function(x, y, drawBounds) {
    drawBounds = drawBounds || false;
    var pos = {
        x: (x !== undefined) ? x : 0, 
        y: (y !== undefined) ? y : 0
    };

    this.p.push();

        if (this._rotation) {
            pos = this._calculateRotatedCoords(pos.x, pos.y, this._rotation);
            this.p.rotate(this._rotation);
        }

        pos = this._calculateAlignedCoords(pos.x, pos.y);

        this.p.textAlign(this.p.LEFT, this.p.BASELINE);
        this.p.textFont(this._font);
        this.p.textSize(this._fontSize);
        this.p.text(this._text, pos.x, pos.y);

        if (drawBounds) {
            this.p.stroke(200);
            var boundsX = pos.x + this._boundsOffset.x;
            var boundsY = pos.y + this._boundsOffset.y;
            this.p.noFill();
            this.p.rect(boundsX, boundsY, this.width, this.height);            
        }

    this.p.pop();
};

/**
 * Project the coordinates (x, y) into a rotated coordinate system
 * @private
 * @param  {number} x     X coordinate (in unrotated space)
 * @param  {number} y     Y coordinate (in unrotated space)
 * @param  {number} angle Radians of rotation to apply
 * @return {object}       Object with x & y properties
 */
BboxAlignedText.prototype._calculateRotatedCoords = function (x, y, angle) {  
    var rx = Math.cos(angle) * x + Math.cos(Math.PI / 2 - angle) * y;
    var ry = -Math.sin(angle) * x + Math.sin(Math.PI / 2 - angle) * y;
    return {x: rx, y: ry};
};

/**
 * Calculates draw coordinates for the text, aligning based on the bounding box.
 * The text is eventually drawn with canvas alignment set to left & baseline, so
 * this function takes a desired pos & alignment and returns the appropriate
 * coordinates for the left & baseline.
 * @private
 * @param  {number} x      X coordinate
 * @param  {number} y      Y coordinate
 * @return {object}        Object with x & y properties
 */
BboxAlignedText.prototype._calculateAlignedCoords = function(x, y) {
    var newX, newY;
    switch (this._hAlign) {
        case BboxAlignedText.ALIGN.LEFT:
            newX = x;
            break;
        case BboxAlignedText.ALIGN.CENTER:
            newX = x - this.halfWidth;
            break;
        case BboxAlignedText.ALIGN.RIGHT:
            newX = x - this.width;
            break;
        default:
            newX = x;
            console.log("Unrecognized horizonal align:", this._hAlign);
            break;
    }
    switch (this._vAlign) {
        case BboxAlignedText.BASELINE.TOP:
            newY = y - this._boundsOffset.y;
            break;
        case BboxAlignedText.BASELINE.CENTER:
            newY = y + this._distBaseToMid;
            break;
        case BboxAlignedText.BASELINE.BOTTOM:
            newY = y - this._distBaseToBottom;
            break;
        case BboxAlignedText.BASELINE.FONT_CENTER:
            // Height is approximated as ascent + descent
            newY = y - this._descent + (this._ascent + this._descent) / 2;
            break;
        case BboxAlignedText.BASELINE.ALPHABETIC:
            newY = y;
            break;
        default:
            newY = y;
            console.log("Unrecognized vertical align:", this._vAlign);
            break;
    }
    return {x: newX, y: newY};
};


/**
 * Calculates bounding box and various metrics for the current text and font
 * @private
 */
BboxAlignedText.prototype._calculateMetrics = function(shouldUpdateHeight) {  
    // p5 0.5.0 has a bug - text bounds are clipped by (0, 0)
    // Calculating bounds hack
    var bounds = this._font.textBounds(this._text, 1000, 1000, this._fontSize);
    bounds.x -= 1000;
    bounds.y -= 1000;

    if (shouldUpdateHeight) {
        this._ascent = this._font._textAscent(this._fontSize);
        this._descent = this._font._textDescent(this._fontSize);
    }

    // Use bounds to calculate font metrics
    this.width = bounds.w;
    this.height = bounds.h;
    this.halfWidth = this.width / 2;
    this.halfHeight = this.height / 2;
    this._boundsOffset = {x: bounds.x, y: bounds.y};
    this._distBaseToMid = Math.abs(bounds.y) - this.halfHeight;
    this._distBaseToBottom = this.height - Math.abs(bounds.y);
};
},{}],2:[function(require,module,exports){
module.exports = {
    NoiseGenerator1D: NoiseGenerator1D,
    NoiseGenerator2D: NoiseGenerator2D
};

// -- 1D Noise Generator -------------------------------------------------------

/**
 * A utility class for generating noise values
 * @constructor
 * @param {object} p               Reference to a p5 sketch
 * @param {number} [min=0]         Minimum value for the noise
 * @param {number} [max=1]         Maximum value for the noise
 * @param {number} [increment=0.1] Scale of the noise, used when updating
 * @param {number} [offset=random] A value used to ensure multiple noise
 *                                 generators are returning "independent" values
 */
function NoiseGenerator1D(p, min, max, increment, offset) {
    this.p = p;
    this.min = (min !== undefined) ? min : 0;
    this.max = (max !== undefined) ? max : 1;
    this.increment = (increment !== undefined) ? increment : 0.1;
    this.position = (offset !== undefined) ? p.random(-1000000, 1000000) : 0;
}

/**
 * Update the min and max noise values
 * @param  {number} min Minimum noise value
 * @param  {number} max Maximum noise value
 */
NoiseGenerator1D.prototype.setBounds = function (min, max) {
    if (min !== undefined) this.min = min;
    if (max !== undefined) this.max = max;
};

/**
 * Update the noise increment (e.g. scale)
 * @param  {number} increment New increment (scale) value
 */
NoiseGenerator1D.prototype.setIncrement = function (increment) {
    if (increment !== undefined) this.increment = increment;
};

/** 
 * Generate the next noise value
 * @return {number} A noisy value between object's min and max
 */
NoiseGenerator1D.prototype.generate = function () {
    this._update();
    var n = this.p.noise(this.position);
    n = this.p.map(n, 0, 1, this.min, this.max);
    return n;
};

/**
 * Internal update method for generating next noise value
 * @private
 */
NoiseGenerator1D.prototype._update = function () {
    this.position += this.increment;
};


// -- 2D Noise Generator -------------------------------------------------------

function NoiseGenerator2D(p, xMin, xMax, yMin, yMax, xIncrement, yIncrement, 
                          xOffset, yOffset) {
    this.xNoise = new NoiseGenerator1D(p, xMin, xMax, xIncrement, xOffset);
    this.yNoise = new NoiseGenerator1D(p, yMin, yMax, yIncrement, yOffset);
    this.p = p;
}

/**
 * Update the min and max noise values
 * @param  {object} options Object with bounds to be updated e.g. 
 *                          { xMin: 0, xMax: 1, yMin: -1, yMax: 1 }
 */
NoiseGenerator2D.prototype.setBounds = function (options) {
    if (!options) return;
    if (options.xMin !== undefined) this.xMin = options.xMin;
    if (options.xMax !== undefined) this.xMax = options.xMax;
    if (options.yMin !== undefined) this.yMin = options.yMin;
    if (options.yMax !== undefined) this.yMax = options.yMax;
};

/**
 * Update the increment (e.g. scale) for the noise generator
 * @param  {object} options Object with bounds to be updated e.g. 
 *                          { xIncrement: 0.05, yIncrement: 0.1 }
 */
NoiseGenerator2D.prototype.setBounds = function (options) {
    if (!options) return;
    if (options.xIncrement !== undefined) this.xNoise.setIncrement(
                                                            options.xIncrement);
    if (options.yIncrement !== undefined) this.yNoise.setIncrement(
                                                            options.yIncrement);
};

/**
 * Generate the next pair of noise values
 * @return {object} Object with x and y properties that contain the next noise
 *                  values along each dimension
 */
NoiseGenerator2D.prototype.generate = function () {
    return {
        x: this.xNoise.generate(),
        y: this.yNoise.generate()
    };
};
},{}],3:[function(require,module,exports){
require("./sketches/noisy-word.js")();
require("./sketches/halftone-flashlight-word.js")();
},{"./sketches/halftone-flashlight-word.js":4,"./sketches/noisy-word.js":5}],4:[function(require,module,exports){
module.exports = startSketch;

// Modules
var dom = require("../utilities/dom-utilities.js");
var Noise = require("../generators/noise-generators.js");
var BboxText = require("p5-bbox-aligned-text");

// Globals
var p, font, circles, bboxText;
var isFirstFrame = true;
var isMouseOver = false;
var canvasSize = {
    width: 400,
    height: 150
};
var text = "halftone";
var fontSize = 150;
var fontPath = "./assets/fonts/leaguegothic-regular-webfont.ttf";

function startSketch() { 
    // Create div on page for the sketch
    var id = "halftone-flashlight-word";
    var sketchesContainer = document.getElementById("sketches");
    var sketchDiv = dom.createElement("div", {id: id}, sketchesContainer);

    // Create a p5 instance inside of the ID specified
    new p5(function (_p) {
        p = _p;
        p.preload = preload;
        p.setup = setup;
        p.draw = draw;
    }, id); 
}

function preload() {
    // Load the font into a global - this way we can ask the font for a bbox
    font = p.loadFont(fontPath);
}

function setup() {
    var renderer = p.createCanvas(canvasSize.width, canvasSize.height);

    // There isn't a good way to check whether the sketch has the mouse over
    // it. p.mouseX & p.mouseY are initialized to (0, 0), and p.focused isn't 
    // always reliable.
    renderer.canvas.addEventListener("mouseover", function () {
        isMouseOver = true;
    });
    renderer.canvas.addEventListener("mouseout", function () {
        isMouseOver = false;
    });

    // Draw the stationary text
    p.background(255);
    p.textSize(fontSize);
    bboxText = new BboxText(font, text, fontSize, p);
    bboxText.setAnchor(BboxText.ALIGN.CENTER, BboxText.BASELINE.FONT_CENTER);
    p.noStroke();
    p.fill("#0A000A");    
    bboxText.draw(p.width / 2, p.height / 2);


    // Loop over the pixels in the text's bounding box to sample the word
    var bbox = bboxText.getBbox(p.width / 2, p.height / 2);
    var startX = Math.floor(Math.max(bbox.x - 5, 0));
    var endX = Math.ceil(Math.min(bbox.x + bbox.w + 5, p.width));
    var startY = Math.floor(Math.max(bbox.y - 5, 0));
    var endY = Math.ceil(Math.min(bbox.y + bbox.h + 5, p.height));
    var spacing = 5;
    p.loadPixels();
    p.pixelDensity(1);
    circles = [];
    for (var y = startY; y < endY; y += spacing) {
        for (var x = startX; x < endX; x += spacing) {  
            var i = 4 * ((y * p.width) + x);
            var r = p.pixels[i];
            var g = p.pixels[i + 1];
            var b = p.pixels[i + 2];
            var a = p.pixels[i + 3];
            var c = p.color(r, g, b, a);
            if (p.saturation(c) > 0) {
                circles.push({
                    x: x + p.random(-2/3 * spacing, 2/3 * spacing),
                    y: y + p.random(-2/3 * spacing, 2/3 * spacing),
                    color: p.color("#06FFFF")
                });
                circles.push({
                    x: x + p.random(-2/3 * spacing, 2/3 * spacing),
                    y: y + p.random(-2/3 * spacing, 2/3 * spacing),
                    color: p.color("#FE00FE")
                });
                circles.push({
                    x: x + p.random(-2/3 * spacing, 2/3 * spacing),
                    y: y + p.random(-2/3 * spacing, 2/3 * spacing),
                    color: p.color("#FFFF04")
                });
            }
        }
    }
    p.updatePixels();
}

function draw() {
    // No need to do anything if the mouse isn't over the sketch
    if (!isMouseOver) return;

    // When the text is about to become active for the first time, clear
    // the stationary logo that was drawn during setup. 
    if (isFirstFrame) {
        p.background(255);
        isFirstFrame = false;
    }

    // Clear
    p.blendMode(p.BLEND);
    p.background(255);

    // Draw "halftone" logo
    p.noStroke();   
    p.blendMode(p.MULTIPLY);
    for (var i = 0; i < circles.length; i += 1) {
        var circle = circles[i];
        var c = circle.color;
        var dist = p.dist(circle.x, circle.y, p.mouseX, p.mouseY);
        var radius = p.map(dist, 0, 150, 1, 10);
        p.fill(c);
        p.ellipse(circle.x, circle.y, radius, radius);
    }
}
},{"../generators/noise-generators.js":2,"../utilities/dom-utilities.js":6,"p5-bbox-aligned-text":1}],5:[function(require,module,exports){
module.exports = startSketch;

// Modules
var dom = require("../utilities/dom-utilities.js");
var Noise = require("../generators/noise-generators.js");

// Globals
var p, font, rotationNoise, xyNoise;
var isFirstFrame = true;
var isMouseOver = false;
var canvasSize = {
	width: 400,
	height: 150
};
var text = "Squiggle";
var fontSize = 100;
var fontPath = "./assets/fonts/leaguegothic-regular-webfont.ttf";

function startSketch() {	
	// Create div on page for the sketch
	var id = "noisy-word";
	var sketchesContainer = document.getElementById("sketches");
	var sketchDiv = dom.createElement("div", {id: id}, sketchesContainer);

	// Create a p5 instance inside of the ID specified
	new p5(function (_p) {
		p = _p;
		p.preload = preload;
		p.setup = setup;
		p.draw = draw;
	}, id);	
}

function preload() {
	// Load the font into a global - this way we can ask the font for a bbox
	font = p.loadFont(fontPath);
}

function setup() {
	var renderer = p.createCanvas(canvasSize.width, canvasSize.height);

	// There isn't a good way to check whether the sketch has the mouse over
	// it. p.mouseX & p.mouseY are initialized to (0, 0), and p.focused isn't 
	// always reliable.
	renderer.canvas.addEventListener("mouseover", function () {
		isMouseOver = true;
	});
	renderer.canvas.addEventListener("mouseout", function () {
		isMouseOver = false;
	});

	// Draw the stationary text
	p.background(255);
	p.textFont(font);
	p.textSize(fontSize);
	p.textAlign(p.CENTER, p.CENTER);
	p.stroke(255);
	p.fill("#0A000A");
	p.strokeWeight(2);		
	p.text(text, p.width / 2, p.height / 2);

	// Set up noise generators
	rotationNoise = new Noise.NoiseGenerator1D(p, -p.PI/4, p.PI/4, 0.02); 
	xyNoise = new Noise.NoiseGenerator2D(p, -100, 100, -50, 50, 0.01, 0.01);
}

function draw() {
	// No need to do anything if the mouse isn't over the sketch
	if (!isMouseOver) return;

	// When the text is about to become active for the first time, clear
	// the stationary logo that was drawn during setup. 
	if (isFirstFrame) {
		p.background(255);
		isFirstFrame = false;
	}

	// Calculate position and rotation to create a jittery logo
	var rotation = rotationNoise.generate();
	var xyOffset = xyNoise.generate();

	// Draw the logo
	p.push();
		p.translate(p.width / 2 + xyOffset.x, p.height / 2 + xyOffset.y);
		p.rotate(rotation);
		p.text(text, 0, 0);
	p.pop();
}
},{"../generators/noise-generators.js":2,"../utilities/dom-utilities.js":6}],6:[function(require,module,exports){
module.exports.forEachInObject = function (object, iterationFunction) {
	if (!object) return;
	for (var key in object) {
		if (!object.hasOwnProperty(key)) continue;
		iterationFunction(key, object[key], object);
	}
};

module.exports.createElement = function (tagName, parameters, parent) {
	var el = document.createElement(tagName);
	if (parameters) {
		if (parameters.textContent) el.textContent = parameters.textContent;
		if (parameters.id) el.id = parameters.id;
		if (parameters.className) el.className = parameters.className;
		if (parameters.style) addStyle(el, parameters.style);
		if (parameters.attributes) addAttributes(el, parameters.attributes);
	}	
	if (parent) parent.appendChild(el);
	return el;
};

module.exports.addStyle = function (element, style) {
	if (!style) return;
	forEachInObject(style, function (key, val) {
		element.style[key] = val;
	});	
};

module.exports.addAttributes = function (element, attributes) {
	if (!attributes) return;
	forEachInObject(attributes, function (key, val) {
		element[key] = val;
	});	
};

module.exports.removeElement = function (element) {
	element.parentElement.removeChild(element);
};
},{}]},{},[3])


//# sourceMappingURL=main/main.js.map
