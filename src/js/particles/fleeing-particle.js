module.exports = FleeingParticle;
var Noise = require("../generators/noise-generators.js");

function FleeingParticle(p, color, radius, position, velocity) {
    this.p = p;
    this._pos = position.copy();
    this._initPos = position.copy();
    this._vel = velocity;
    this._color = color;
    this._radius = radius;
    this._noiseGenerator = new Noise.NoiseGenerator1D(p, 0, 1, 0.1);
    this._maxVelocity = 5;

    this._xMax = this.p.width + this._radius;
    this._xMin = -this._radius;
    this._yMax = this.p.height + this._radius;
    this._yMin = -this._radius;
}

FleeingParticle.prototype.headTowardsInitial = function () {
    var dx = this._initPos.x - this._pos.x;
    var dy = this._initPos.y - this._pos.y;
    var dist = Math.sqrt(dx * dx + dy * dy);
    var angle = this.p.atan2(dy, dx);

    var noiseMax = this.p.map(dist, 50, 0, this.p.TWO_PI/2, 0);
    noiseMax = Math.min(noiseMax, this.p.TWO_PI/2);
    var noise = this._noiseGenerator.generate();
    noise = this.p.map(noise, 0, 1, -noiseMax, noiseMax);
    angle += noise;

    this._vel.x = Math.cos(angle) * Math.min(this._maxVelocity, dist);
    this._vel.y = Math.sin(angle) * Math.min(this._maxVelocity, dist);
};

FleeingParticle.prototype.avoid = function (x, y) {
    var dx = this._pos.x - x;
    var dy = this._pos.y - y;
    var angle = this.p.atan2(dy, dx);
    var dist = Math.sqrt(dx * dx + dy * dy);

    var noiseMax = this.p.map(dist, 0, 50, 0, this.p.TWO_PI/2);
    noiseMax = Math.min(noiseMax, this.p.TWO_PI/2);
    var noise = this._noiseGenerator.generate();
    noise = this.p.map(noise, 0, 1, -noiseMax, noiseMax);
    angle += noise;

    this._vel.x = Math.cos(angle) * this._maxVelocity;
    this._vel.y = Math.sin(angle) * this._maxVelocity;
};

FleeingParticle.prototype.update = function () {
    this._pos.add(this._vel);
};

FleeingParticle.prototype.draw = function () {
    if (this._isOffscreen()) return;
    this.p.push();
        this.p.fill(this._color);
        this.p.noStroke();
        this.p.ellipse(this._pos.x, this._pos.y, this._radius, this._radius);
    this.p.pop();
};

FleeingParticle.prototype._isOffscreen = function () {
    if (this._pos.x > this._xMax) return true;
    if (this._pos.x < this._xMin) return true;    
    if (this._pos.y > this._yMax) return true;    
    if (this._pos.y < this._yMin) return true;
    return false;
};