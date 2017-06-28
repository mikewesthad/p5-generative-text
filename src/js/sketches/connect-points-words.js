import p5 from "p5/lib/p5.min.js"; // Min disables slow error warnings
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

        const bboxText = new BboxText(this._font, "unchecked", 100)
            .setAnchor(BboxText.ALIGN.BOX_CENTER, BboxText.BASELINE.BOX_CENTER)
        this._points = bboxText.getTextPoints(p.width / 2, p.height / 2, 
            {sampleFactor: 0.25});

        this._time = performance.now(); 
    }

    draw(p) {
        const now = performance.now();
        const elapsedSeconds = (now - this._time) / 1000;
        this._time = now;

        if (this._isMouseOver || p.frameCount <= 1) {
            p.background(255);

            let distanceThreshold = p.map(p.mouseX, 0, p.width, 6, 15);
            distanceThreshold = p.constrain(distanceThreshold, 6, 15);

            p.stroke("#630066");
            p.strokeWeight(1);
            for (let i = 0; i < this._points.length; i++) {
                var point1 = this._points[i];
                for (let j = i + 1; j < this._points.length; j++) {
                    var point2 = this._points[j];
                    var dist = p.dist(point1.x, point1.y, point2.x, point2.y);
                    if (dist < distanceThreshold) {
                        p.line(point1.x, point1.y, point2.x, point2.y);                    
                    }
                }
            }
        }
    }

    remove() {
        this.p.remove();
    }
}

