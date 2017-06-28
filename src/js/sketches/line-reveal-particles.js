import p5 from "p5/lib/p5.min.js"; // Min disables slow error warnings
import NoiseGenerator from "../generators/noise-generator";
import BboxText from "p5-bbox-aligned-text";
import LineParticle from "../particles/line-particle";

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
            `./assets/fonts/${"theleagueof-league-gothic/leaguegothic-regular-webfont.ttf"}`
        );
    }

    setup(p) {
        const renderer = p.createCanvas(400, 150);

        // Track the state of the mouse - p5 doesn't provide a way to do this
        this._isMouseOver = false;
        renderer.canvas.addEventListener("mouseover", () => {this._isMouseOver = true});
        renderer.canvas.addEventListener("mouseout", () => {this._isMouseOver = false});

        const bboxText = new BboxText(this._font, "POTENTIAL", 100)
            .setAnchor(BboxText.ALIGN.BOX_CENTER, BboxText.BASELINE.BOX_CENTER)
        this._points = bboxText.getTextPoints(p.width / 2, p.height / 2, 
            {sampleFactor: 0.6});

        this._time = performance.now(); 

        this._lineParticles = [];
        for (let i = 0; i < 25; i++) {
            this._lineParticles.push(
                new LineParticle(p, {x: p.random(p.width), y: p.random(p.height)})
            );
        }
    }

    draw(p) {
        const now = performance.now();
        const elapsedSeconds = (now - this._time) / 1000;
        this._time = now;

        if (this._isMouseOver || p.frameCount <= 1) {
            p.background(255);

            for (const lineParticle of this._lineParticles) {
                lineParticle.update(elapsedSeconds);
                lineParticle.draw(this._points, [36, 255, 167]);
            } 
        }
    }

    remove() {
        this.p.remove();
    }
}