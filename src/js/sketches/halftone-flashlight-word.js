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