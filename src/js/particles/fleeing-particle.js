import NoiseGenerator from "../generators/noise-generator";

const BEHAVIOR = {
    AVOID: 0,
    SEEK: 1,
    IDLE: 2
};

export default class FleeingParticle {
    constructor(p, position, radius, color) {
        this.p = p;
        this._pos = position.copy();
        this._initPos = position.copy();
        this._color = color;
        this._radius = radius;
        this._noise = new NoiseGenerator({instance: p, min: -Math.PI, max: Math.PI, speed: 10});

        this._behavior = BEHAVIOR.IDLE;
        this._target = null;

        this._xMax = this.p.width + this._radius;
        this._xMin = -this._radius;
        this._yMax = this.p.height + this._radius;
        this._yMin = -this._radius;
    }

    setTargetToHome() {
        if (this._pos.x !== this._initPos.x && this._pos.y !== this._initPos.y) {
            this._behavior = BEHAVIOR.SEEK;
            this._target = this._initPos;
        }
    }

    setPointToAvoid(x, y) {
        this._behavior = BEHAVIOR.AVOID;
        this._target = {x, y};
    }

    update(elapsedTime) {
        // Idle - no need to do anything
        if (this._behavior === BEHAVIOR.IDLE) return;

        // Find the dist and angle to target
        let dx, dy;
        if (this._behavior === BEHAVIOR.AVOID) {
            dx = this._pos.x - this._target.x;
            dy = this._pos.y - this._target.y;
        } else {
            dx = this._target.x - this._pos.x;
            dy = this._target.y - this._pos.y;
        }
        const dist = Math.sqrt(dx * dx + dy * dy);
        let angle = this.p.atan2(dy, dx);

        // Add noise to the angle based on distance from target
        const angleNoise = this._noise.addTime(elapsedTime).getCurrentValue();
        const distScale = this._clampedMap(dist, 0, 50, 0, 1);
        angle += distScale * angleNoise;
        
        // Update the position
        const maxVelocity = 5;
        if (this._behavior === BEHAVIOR.AVOID) {
            // Head with max speed away
            this._pos.x += Math.cos(angle) * maxVelocity;
            this._pos.y += Math.sin(angle) * maxVelocity;
        } else {
            // Don't overshoot the target
            this._pos.x += Math.cos(angle) * Math.min(maxVelocity, dist);
            this._pos.y += Math.sin(angle) * Math.min(maxVelocity, dist);
            if (this._pos.x === this._target.x && this._pos.y === this._target.y) {
                this._behavior = BEHAVIOR.IDLE;
            }
        }
    }

    draw() {
        if (this._isOffscreen()) return;
        this.p.push();
            this.p.fill(this._color);
            this.p.noStroke();
            this.p.ellipse(this._pos.x, this._pos.y, this._radius, this._radius);
        this.p.pop();
    }

    _isOffscreen() {
        if (this._pos.x > this._xMax) return true;
        if (this._pos.x < this._xMin) return true;    
        if (this._pos.y > this._yMax) return true;    
        if (this._pos.y < this._yMin) return true;
        return false;
    }

    _clampedMap(val, valMin, valMax, newMin, newMax) {
        let newVal = this.p.map(val, valMin, valMax, newMin, newMax);
        if (newMin > newMax) newVal = this.p.constrain(newVal, newMax, newMin);
        else newVal = this.p.constrain(newVal, newMin, newMax);        
        return newVal;
    }
}