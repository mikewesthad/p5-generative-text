import p5 from "p5/lib/p5.min.js"; // Min disables slow error warnings
import BboxText from "p5-bbox-aligned-text";
import FleeingParticle from "../particles/fleeing-particle";

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
        this._font = p.loadFont("./assets/fonts/josefin-slab/JosefinSlab-Bold.ttf");
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
        const bboxText = new BboxText(this._font, "freedom", 100)
            .setAnchor(BboxText.ALIGN.BOX_CENTER, BboxText.BASELINE.BOX_CENTER)
            .setPInstance(p)
            .setPosition(p.width / 2, p.height / 2)
        bboxText.draw();
        const bbox = bboxText.getBbox(p.width / 2, p.height / 2);
        this._particles = this._createParticles(p, bbox);

        this._time = performance.now(); 
    }

    _createParticles(p, bbox) {
        const particles = [];
        // Loop over the pixels in the text's bounding box to sample the word
        const startX = Math.floor(Math.max(bbox.x - 5, 0));
        const endX = Math.ceil(Math.min(bbox.x + bbox.w + 5, p.width));
        const startY = Math.floor(Math.max(bbox.y - 5, 0));
        const endY = Math.ceil(Math.min(bbox.y + bbox.h + 5, p.height));
        const spacing = 5;
        p.loadPixels();
        p.pixelDensity(1);
        const jitter = () => p.random(-2/3 * spacing, 2/3 * spacing);
        const particleRadius = 8;
        for (let y = startY; y < endY; y += spacing) {
            for (let x = startX; x < endX; x += spacing) {  
                const i = 4 * ((y * p.width) + x);
                const [r, g, b, a] = p.pixels.slice(i, i + 4);
                var c = p.color(r, g, b, a);
                if (p.saturation(c) > 0) {
                    for (const hex of ["#06FFFF", "#FE00FE", "#FFFF04"]) {
                        const pos = p.createVector(x + jitter(), y + jitter());
                        const radius = particleRadius + p.random(-3, 1);
                        const particle = new FleeingParticle(p, pos, radius, p.color(hex));
                        particles.push(particle);
                    }
                }
            }
        }
        p.updatePixels();
        return particles;
    }

    draw(p) {
        const now = performance.now();
        const elapsedSeconds = (now - this._time) / 1000;
        this._time = now;

        // Clear
        p.blendMode(p.BLEND);
        p.background(255);

        // Draw & update particles, but in multiple blend mode!
        p.noStroke();   
        p.blendMode(p.MULTIPLY);
        for (const particle of this._particles) {
            if (this._isMouseOver) particle.setPointToAvoid(p.mouseX, p.mouseY);
            else particle.setTargetToHome();
            particle.update(elapsedSeconds);
            particle.draw();
        }
    }

    remove() {
        this.p.remove();
    }
}

