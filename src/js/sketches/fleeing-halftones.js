module.exports = startSketch;

// Modules
var dom = require("../utilities/dom-utilities.js");
var Noise = require("../generators/noise-generators.js");
var BboxText = require("p5-bbox-aligned-text");
var FleeingParticle = require("../particles/fleeing-particle.js");

// Globals
var p, font;
var particles = [];
var isFirstFrame = true;
var isMouseOver = false;
var canvasSize = {
    width: 400,
    height: 150
};
var text = "scatter";
var fontSize = 140;
var fontsFolder = "./assets/fonts/";
var fontPath = fontsFolder + "josefin-slab/JosefinSlab-Bold.ttf";

function startSketch() { 
    // Create div on page for the sketch
    var id = "fleeing-halftones";
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
    bboxText.setAnchor(BboxText.ALIGN.BOX_CENTER, 
                       BboxText.BASELINE.FONT_CENTER);
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
    var jitter = p.random.bind(p, -2/3 * spacing, 2/3 * spacing);
    var particleRadius = 8;
    for (var y = startY; y < endY; y += spacing) {
        for (var x = startX; x < endX; x += spacing) {  
            var i = 4 * ((y * p.width) + x);
            var r = p.pixels[i];
            var g = p.pixels[i + 1];
            var b = p.pixels[i + 2];
            var a = p.pixels[i + 3];
            var c = p.color(r, g, b, a);
            if (p.saturation(c) > 0) {
                var pos = p.createVector(x + jitter(), y + jitter());
                var vel = randomVelocity(); 
                var col = p.color("#06FFFF");
                var rad = particleRadius + p.random(-3, 1);
                var particle = new FleeingParticle(p, col, rad, 
                                                   pos, vel);
                particles.push(particle);

                var pos = p.createVector(x + jitter(), y + jitter());
                var vel = randomVelocity();
                var col = p.color("#FE00FE");
                var rad = particleRadius + p.random(-3, 1);
                var particle = new FleeingParticle(p, col, rad, 
                                                   pos, vel);
                particles.push(particle);

                var pos = p.createVector(x + jitter(), y + jitter());
                var vel = randomVelocity();
                var col = p.color("#FFFF04");
                var rad = particleRadius + p.random(-3, 1);
                var particle = new FleeingParticle(p, col, rad, 
                                                   pos, vel);
                particles.push(particle);
            }
        }
    }
    p.updatePixels();
}

function randomVelocity() {
    var angle = p.random(0, p.TWO_PI);
    var magnitude = p.random(2, 10);
    var velocity = p.createVector(magnitude * Math.cos(angle),
                                  magnitude * Math.sin(angle));
    return velocity;
}

function draw() {
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
    for (var i = 0; i < particles.length; i += 1) {
        var particle = particles[i];

        if (isMouseOver) particle.avoid(p.mouseX, p.mouseY);
        else particle.headTowardsInitial();

        particle.update();
        particle.draw();
    }
}