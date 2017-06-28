import p5 from "p5/lib/p5.min.js"; // Min disables slow error warnings
import WaveGenerator from "../generators/wave-generator";
import TextParticle from "../particles/text-particle";
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
        this._font = p.loadFont("./assets/fonts/league-spartan/leaguespartan-bold.ttf");
    }

    setup(p) {
        const renderer = p.createCanvas(400, 150);

        // Track the state of the mouse - p5 doesn't provide a way to do this
        this._isMouseOver = false;
        renderer.canvas.addEventListener("mouseover", () => {this._isMouseOver = true});
        renderer.canvas.addEventListener("mouseout", () => {this._isMouseOver = false});

        // Text setup
        p.background(255);
        p.textFont(this._font);
        p.textSize(50);
        p.textAlign(p.CENTER, p.CENTER);
        p.stroke(255);
        p.fill("#00ACE0");
        p.strokeWeight(2);
        
        // Create the word particle
        const pos = p.createVector(p.width / 2, p.height / 2);
        const vel = p.createVector(3, -1); 
        this._textParticle = new TextParticle(p, this._font, 50, "ripple", pos, vel);

        this._rotGenerator = new WaveGenerator({
            min: -Math.PI / 5, max: Math.PI / 5, frequency: 0.5
        });
        this._dirGenerator = new NoiseGenerator({
            instance: p, min: 0, max: 2 * Math.PI, speed: 0.1
        });

        this._time = performance.now(); 
    }

    draw(p) {
        const now = performance.now();
        const elapsedSeconds = (now - this._time) / 1000;
        this._time = now;
        
        if (this._isMouseOver || p.frameCount <= 1) {
            // Update the particles velocity and rotation
            const angle = this._dirGenerator.addTime(elapsedSeconds).getCurrentValue();
            this._textParticle.setVelocity({x: p.cos(angle) * 1.25, y: p.sin(angle) * 1.25});
            const rotation = this._rotGenerator.addTime(elapsedSeconds).getCurrentValue();
            this._textParticle.setRotation(rotation);
            this._textParticle.update();

            // Draw the particle
            p.fill("#00ACE0");
            p.stroke(255);
            p.strokeWeight(1);
            this._textParticle.draw();
        }
    }

    remove() {
        this.p.remove();
    }
}

