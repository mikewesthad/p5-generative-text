module.exports = {
    NoiseGenerator1D: NoiseGenerator1D,
    NoiseGenerator2D: NoiseGenerator2D
};

// -- 1D Noise Generator -------------------------------------------------------

/**
 * A utility class for generating noise values
 * @constructor
 * @param {object} p               Reference to a p5 sketch
 * @param {number} [min=0]         Minimum value for the noise
 * @param {number} [max=1]         Maximum value for the noise
 * @param {number} [increment=0.1] Scale of the noise, used when updating
 * @param {number} [offset=random] A value used to ensure multiple noise
 *                                 generators are returning "independent" values
 */
function NoiseGenerator1D(p, min, max, increment, offset) {
    this.p = p;
    this.min = (min !== undefined) ? min : 0;
    this.max = (max !== undefined) ? max : 1;
    this.increment = (increment !== undefined) ? increment : 0.1;
    this.position = (offset !== undefined) ? p.random(-1000000, 1000000) : 0;
}

/**
 * Update the min and max noise values
 * @param  {number} min Minimum noise value
 * @param  {number} max Maximum noise value
 */
NoiseGenerator1D.prototype.setBounds = function (min, max) {
    if (min !== undefined) this.min = min;
    if (max !== undefined) this.max = max;
};

/**
 * Update the noise increment (e.g. scale)
 * @param  {number} increment New increment (scale) value
 */
NoiseGenerator1D.prototype.setIncrement = function (increment) {
    if (increment !== undefined) this.increment = increment;
};

/** 
 * Generate the next noise value
 * @return {number} A noisy value between object's min and max
 */
NoiseGenerator1D.prototype.generate = function () {
    this._update();
    var n = this.p.noise(this.position);
    n = this.p.map(n, 0, 1, this.min, this.max);
    return n;
};

/**
 * Internal update method for generating next noise value
 * @private
 */
NoiseGenerator1D.prototype._update = function () {
    this.position += this.increment;
};


// -- 2D Noise Generator -------------------------------------------------------

function NoiseGenerator2D(p, xMin, xMax, yMin, yMax, xIncrement, yIncrement, 
                          xOffset, yOffset) {
    this.xNoise = new NoiseGenerator1D(p, xMin, xMax, xIncrement, xOffset);
    this.yNoise = new NoiseGenerator1D(p, yMin, yMax, yIncrement, yOffset);
    this.p = p;
}

/**
 * Update the min and max noise values
 * @param  {object} options Object with bounds to be updated e.g. 
 *                          { xMin: 0, xMax: 1, yMin: -1, yMax: 1 }
 */
NoiseGenerator2D.prototype.setBounds = function (options) {
    if (!options) return;
    if (options.xMin !== undefined) this.xMin = options.xMin;
    if (options.xMax !== undefined) this.xMax = options.xMax;
    if (options.yMin !== undefined) this.yMin = options.yMin;
    if (options.yMax !== undefined) this.yMax = options.yMax;
};

/**
 * Update the increment (e.g. scale) for the noise generator
 * @param  {object} options Object with bounds to be updated e.g. 
 *                          { xIncrement: 0.05, yIncrement: 0.1 }
 */
NoiseGenerator2D.prototype.setBounds = function (options) {
    if (!options) return;
    if (options.xIncrement !== undefined) this.xNoise.setIncrement(
                                                            options.xIncrement);
    if (options.yIncrement !== undefined) this.yNoise.setIncrement(
                                                            options.yIncrement);
};

/**
 * Generate the next pair of noise values
 * @return {object} Object with x and y properties that contain the next noise
 *                  values along each dimension
 */
NoiseGenerator2D.prototype.generate = function () {
    return {
        x: this.xNoise.generate(),
        y: this.yNoise.generate()
    };
};