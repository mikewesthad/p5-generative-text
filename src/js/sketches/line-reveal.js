import p5 from "p5/lib/p5.min.js"; // Min disables slow error warnings
import NoiseGenerator from "../generators/noise-generator";
import BboxText from "p5-bbox-aligned-text";

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

        const bboxText = new BboxText(this._font, "PERSPECTIVE", 100)
            .setAnchor(BboxText.ALIGN.BOX_CENTER, BboxText.BASELINE.BOX_CENTER)
        this._points = bboxText.getTextPoints(p.width / 2, p.height / 2, 
            {sampleFactor: 0.5});

        this._xNoise = new NoiseGenerator({instance: p, min: 0, max: p.width, speed: 0.25});   
        this._yNoise = new NoiseGenerator({instance: p, min: 0, max: p.height, speed: 0.5});
        
        this._time = performance.now(); 
    }

    draw(p) {
        const now = performance.now();
        const elapsedSeconds = (now - this._time) / 1000;
        this._time = now;

        if (this._isMouseOver || p.frameCount <= 1) {
            p.background(255);

            const x = this._xNoise.addTime(elapsedSeconds).getCurrentValue();
            const y = this._yNoise.addTime(elapsedSeconds).getCurrentValue();

            const maxDistance = 200;
            for (const point of this._points) {
                const d = p.dist(x, y, point.x, point.y);
                if (d < maxDistance) {
                    p.stroke(255, 67, 10, p.map(d, 0, maxDistance, 100, 0));
                    p.line(x, y, point.x, point.y);
                }
            }
        }
    }

    remove() {
        this.p.remove();
    }
}