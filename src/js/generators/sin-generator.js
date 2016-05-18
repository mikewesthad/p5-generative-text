module.exports = SinGenerator;

/**
 * A utility class for generating values along a sinwave
 * @constructor
 * @param {object} p               Reference to a p5 sketch
 * @param {number} [min=0]         Minimum value for the noise
 * @param {number} [max=1]         Maximum value for the noise
 * @param {number} [increment=0.1] Increment used when updating
 * @param {number} [offset=random] Where to start along the sinewave
 */
function SinGenerator(p, min, max, angleIncrement, startingAngle) {
    this.p = p;
    this.min = (min !== undefined) ? min : 0;
    this.max = (max !== undefined) ? max : 1;
    this.increment = (angleIncrement !== undefined) ? angleIncrement : 0.1;
    this.angle = (startingAngle !== undefined) ? startingAngle :
                                                 p.random(-1000000, 1000000);
}

/**
 * Update the min and max values
 * @param  {number} min Minimum value
 * @param  {number} max Maximum value
 */
SinGenerator.prototype.setBounds = function (min, max) {
    if (min !== undefined) this.min = min;
    if (max !== undefined) this.max = max;
};

/**
 * Update the angle increment (e.g. how fast we move through the sinwave)
 * @param  {number} increment New increment value
 */
SinGenerator.prototype.setIncrement = function (increment) {
    if (increment !== undefined) this.increment = increment;
};

/** 
 * Generate the next value
 * @return {number} A value between generators's min and max
 */
SinGenerator.prototype.generate = function () {
    this._update();
    var n = this.p.sin(this.angle);
    n = this.p.map(n, -1, 1, this.min, this.max);
    return n;
};

/**
 * Internal update method for generating next value
 * @private
 */
SinGenerator.prototype._update = function () {
    this.angle += this.increment;
};