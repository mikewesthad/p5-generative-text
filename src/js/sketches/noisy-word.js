import p5 from "p5/lib/p5.min.js"; // Min disables slow error warnings
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

        // Text setup
        this._text = "squiggle";
        p.background(255);
        p.textFont(this._font);
        p.textSize(100);
        p.textAlign(p.CENTER, p.CENTER);
        p.stroke(255);
        p.fill("#0A000A");
        p.strokeWeight(2);

        const range = Math.PI / 4;
        this._rotNoise = new NoiseGenerator({instance: p, min: -range, max: range, speed: 0.1});
        this._xNoise = new NoiseGenerator({instance: p, min: -100, max: 100, speed: 0.75});
        this._yNoise = new NoiseGenerator({instance: p, min: -50, max: 50, speed: 0.5});

        this._time = performance.now(); 
    }

    draw(p) {
        const now = performance.now();
        const elapsedSeconds = (now - this._time) / 1000;
        this._time = now;

        if (this._isMouseOver || p.frameCount <= 1) {
            const dx = this._xNoise.addTime(elapsedSeconds).getCurrentValue();
            const dy = this._yNoise.addTime(elapsedSeconds).getCurrentValue();
            const rot = this._rotNoise.addTime(elapsedSeconds).getCurrentValue();
            p.push();
                p.translate(p.width / 2 + dx, p.height / 2 + dy);
                p.rotate(rot);
                p.text(this._text, 0, 0);
            p.pop();
        }
    }

    remove() {
        this.p.remove();
    }
}

