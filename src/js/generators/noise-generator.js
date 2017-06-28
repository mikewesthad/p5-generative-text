export default class NoiseGenerator {    
    /**
     * @param {object} [options={}]
     * @param {number} [options.instance=0] Reference to p5 instance, if using p5 in instance mode
     * @param {number} [options.min=0] Minimum value of the output of the generator
     * @param {number} [options.max=1] Maximum value of the output of the generator
     * @param {number} [options.noiseSpeed=0.5] Rate of change of the noise over time (in seconds)
     * @param {number} [offset=random] A value used to ensure multiple noise generators are
     * returning "independent" values
     */
    constructor({instance = undefined, min = 0, max = 1, speed = 0.5, offset = undefined} = {}) {
        this.p = (instance !== undefined) ? instance : window;
        this._min = min;
        this._max = max;
        this._speed = speed;
        this._time = (offset !== undefined) ? offset : this.p.random(-1000000, 1000000);
    }

    addTime(deltaTime = 0) {
        this._time += deltaTime;
        return this;
    }

    setTimeTo(time) {
        this._time = time;
        return this;
    }
    
    getCurrentValue() {
        let value = this.p.noise(this._speed * this._time);
        value = this.p.map(value, 0, 1, this._min, this._max);
        return value;
    }
}