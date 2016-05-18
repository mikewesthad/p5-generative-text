(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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
},{}],2:[function(require,module,exports){
require("./sketches/noisy-word.js")();
require("./sketches/halftone-flashlight-word.js")();
},{"./sketches/halftone-flashlight-word.js":3,"./sketches/noisy-word.js":4}],3:[function(require,module,exports){
module.exports = startSketch;

// Modules
var dom = require("../utilities/dom-utilities.js");
var Noise = require("../generators/noise-generators.js");

// Globals
var p, font, circles;
var isFirstFrame = true;
var isMouseOver = false;
var canvasSize = {
    width: 400,
    height: 150
};
var text = "String";
var fontSize = 130;
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
    p.textFont(font);
    p.textSize(fontSize);
    p.textAlign(p.CENTER, p.CENTER);
    p.noStroke();
    p.fill("#0A000A");    
    p.text(text, p.width / 2, p.height / 2);

    // Loop over the pixels in the canvas to sample the word
    var spacing = 5;
    p.loadPixels();
    p.pixelDensity(1);
    circles = [];
    for (var y = 0; y < p.height; y += spacing) {
        for (var x = 0; x < p.width; x += spacing) {            
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
        var radius = p.map(dist, 0, 120, 1, 10);
        p.fill(c);
        p.ellipse(circle.x, circle.y, radius, radius);
    }
}
},{"../generators/noise-generators.js":1,"../utilities/dom-utilities.js":5}],4:[function(require,module,exports){
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
var text = "String";
var fontSize = 120;
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
},{"../generators/noise-generators.js":1,"../utilities/dom-utilities.js":5}],5:[function(require,module,exports){
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
},{}]},{},[2])


//# sourceMappingURL=main/main.js.map
