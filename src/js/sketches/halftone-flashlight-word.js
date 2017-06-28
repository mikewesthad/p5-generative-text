import p5 from "p5/lib/p5.min.js"; // Min disables slow error warnings
import BboxText from "p5-bbox-aligned-text";
import NoiseGenerator from "../generators/noise-generator";

export default class Sketch {
    /**
     * @param {HTMLElement} element Node to append the sketch to
     * @memberof Sketch
     */
    constructor(element) {
        new p5(p => {
            this.p = p;
            p.preload = () => this.preload(p);
            p.setup = () => this.setup(p);
            p.draw = () => this.draw(p);
        }, element);
    }

    preload(p) {
        this._font = p.loadFont(
            "./assets/fonts/theleagueof-league-gothic/leaguegothic-regular-webfont.ttf"
        );
    }

    setup(p) {
        const renderer = p.createCanvas(400, 150);

        // Track the state of the mouse - p5 doesn't provide a way to do this
        this._isMouseOver = false;
        renderer.canvas.addEventListener("mouseover", () => {this._isMouseOver = true});
        renderer.canvas.addEventListener("mouseout", () => {this._isMouseOver = false});

        // Draw text and create particles from the pixels
        p.noStroke();
        p.fill("#0A000A");
        const bboxText = new BboxText(this._font, "halftone", 130)
            .setAnchor(BboxText.ALIGN.BOX_CENTER, BboxText.BASELINE.BOX_CENTER)
            .setPInstance(p)
            .setPosition(p.width / 2, p.height / 2)
        bboxText.draw();
        const bbox = bboxText.getBbox(p.width / 2, p.height / 2);
        this._circles = this._createCircles(p, bbox);

        this._time = performance.now(); 
    }

    _createCircles(p, bbox) {
        const circles = [];
        // Loop over the pixels in the text's bounding box to sample the word
        const startX = Math.floor(Math.max(bbox.x - 5, 0));
        const endX = Math.ceil(Math.min(bbox.x + bbox.w + 5, p.width));
        const startY = Math.floor(Math.max(bbox.y - 5, 0));
        const endY = Math.ceil(Math.min(bbox.y + bbox.h + 5, p.height));
        const spacing = 5;
        p.loadPixels();
        p.pixelDensity(1);
        const jitter = () => p.random(-2/3 * spacing, 2/3 * spacing);
        for (let y = startY; y < endY; y += spacing) {
            for (let x = startX; x < endX; x += spacing) {  
                const i = 4 * ((y * p.width) + x);
                const [r, g, b, a] = p.pixels.slice(i, i + 4);
                var c = p.color(r, g, b, a);
                if (p.saturation(c) > 0) {
                    for (const hex of ["#06FFFF", "#FE00FE", "#FFFF04"]) {
                        circles.push({
                            x: x + jitter(), y: y + jitter(), color: p.color(hex)
                        });
                    }
                }
            }
        }
        p.updatePixels();
        return circles;
    }

    draw(p) {
        const now = performance.now();
        const elapsedSeconds = (now - this._time) / 1000;
        this._time = now;

        if (this._isMouseOver || p.frameCount <= 1) {
            // Clear
            p.blendMode(p.BLEND);
            p.background(255);

            // Draw & update particles, but in multiple blend mode!
            p.noStroke();   
            p.blendMode(p.MULTIPLY);
            for (const circle of this._circles) {
                var dist = p.dist(circle.x, circle.y, p.mouseX, p.mouseY);
                var radius = p.map(dist, 0, 150, 1, 10);
                p.fill(circle.color);
                p.ellipse(circle.x, circle.y, radius, radius);
            }
        }
    }

    remove() {
        this.p.remove();
    }
}

