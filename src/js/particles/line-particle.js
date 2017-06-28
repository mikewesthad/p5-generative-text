import NoiseGenerator from "../generators/noise-generator";

export default class LineParticle {
    constructor(p, position) {
        this.p = p;
        this._position = position;
        this._noise = new NoiseGenerator({instance: p, min: 0, max: 2 * Math.PI, speed: 0.5});
    }

    update(elapsedTime) {
        const angle = this._noise.addTime(elapsedTime).getCurrentValue();
        this._position.x += 1.25 * Math.cos(angle);
        this._position.y += 1.25 * Math.sin(angle);

        if (this._position.x > this.p.width) this._position.x -= this.p.width;
        if (this._position.x < 0) this._position.x += this.p.width;
        if (this._position.y > this.p.height) this._position.y -= this.p.height;
        if (this._position.y < 0) this._position.y += this.p.height;
    }
    
    draw(points, rgb = [0, 0, 0]) {
        const p = this.p;
        const distanceThreshold = 35;
        for (const point of points) {
            const d = p.dist(this._position.x, this._position.y, point.x, point.y);
            if (d < distanceThreshold) {
                p.stroke(...rgb, p.map(d, 0, distanceThreshold, 255, 0));
                p.line(this._position.x, this._position.y, point.x, point.y);
            }
        }
    }
}