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