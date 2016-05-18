module.exports = startSketch;

// Modules
var dom = require("../utilities/dom-utilities.js");
var Noise = require("../generators/noise-generators.js");
var SinGenerator = require("../generators/sin-generator.js");
var TextParticle = require("../particles/text-particle.js");

// Globals
var p, font, textParticle, rotationGenerator, sinGenerator;
var isFirstFrame = true;
var isMouseOver = false;
var canvasSize = {
    width: 400,
    height: 150
};
var text = "Ripple";
var fontSize = 50;
var fontPath = "./assets/fonts/leaguegothic-regular-webfont.ttf";

function startSketch() {    
    // Create div on page for the sketch
    var id = "word-particle-wrapping";
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
    p.fill("#00ACE0");
    p.strokeWeight(2);      
    p.text(text, p.width / 2, p.height / 2);

    // Create the word particle
    var pos = p.createVector(p.width / 2, p.height / 2);
    var vel = p.createVector(3, -1); 
    textParticle = new TextParticle(p, font, fontSize, text, pos, vel);

    rotationGenerator = new SinGenerator(p, -Math.PI/5, Math.PI/5, 0.06);
    directionGenerator = new Noise.NoiseGenerator1D(p, 0, p.TWO_PI, 0.005);
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

    // Update the particles velocity and rotation
    var angle = directionGenerator.generate();
    textParticle.setVelocity({x: p.cos(angle) * 1.25, y: p.sin(angle) * 1.25});
    var rotation = rotationGenerator.generate();
    textParticle.setRotation(rotation);
    textParticle.update();

    // Draw the particle
    p.fill("#00ACE0");
    p.stroke(255);
    p.strokeWeight(1);
    textParticle.draw();
}