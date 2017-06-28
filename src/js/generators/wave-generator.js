/**
 * A class for generating values along a wave (e.g. sine wave or cosine wave). Each instance keeps
 * track of where it is along the wave.
 *  
 * @export
 * @class WaveGenerator
 */
export default class WaveGenerator {
    /**
     * Creates an instance of WaveGenerator.
     * @param {object} [options={}]
     * @param {number} [options.min=-1] Minimum value of the output of the wave
     * @param {number} [options.max=1] Maximum value of the output of the wave
     * @param {number} [frequency=1] Number of oscillations per second
     * @param {number} [phase=0] The starting point for the wave in radians
     * @memberof WaveGenerator
     */
    constructor({min = -1, max = 1, frequency = 1, phase = 0} = {}) {
        this._phase = phase;
        this._time = 0;
        this.setFrequency(frequency);
        this.setBounds(min, max);
    }
    
    setFrequency(frequency) {
        this._angularFrequency = (2 * Math.PI) * frequency;
        return this;
    }

    setBounds(min, max) {
        this._min = min;
        this._max = max;
        this._amplitude = (this._max - this._min) / 2;
        this._offset = this._min + this._amplitude; 
        return this;
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
        return this._amplitude * Math.sin((this._angularFrequency * this._time) + this._phase)
            + this._offset;
    }
}