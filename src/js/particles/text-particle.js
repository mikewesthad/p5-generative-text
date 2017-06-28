import BboxText from "p5-bbox-aligned-text";

export default class TextParticle {
    constructor(p, font, fontSize, text, position, velocity) {
        this.p = p;
        this._pos = position;
        this._vel = velocity;
        this._rotation = 0;
        this._bboxText = new BboxText(font, text, fontSize)
            .setPInstance(p);
        this._bboxText.setAnchor(BboxText.ALIGN.BOX_CENTER, BboxText.BASELINE.BOX_CENTER);

        // Calculate particle bounds
        const bounds = this._bboxText.getBbox(this._pos.x, this._pos.y);
        this.width = bounds.w;
        this.halfWidth = bounds.w / 2;
        this.height = bounds.h;
        this.halfHeight = bounds.h / 2;

        // Holding on to the offscreen position for when the word is partially 
        // offscreen, but not completely offscreen.
        this._wrappedPos = null;
        this._xReflectPos = null;
        this._yReflectPos = null;
    }

    setVelocity(velocity) {
        this._vel.x = velocity.x;
        this._vel.y = velocity.y;
    }

    setRotation(radians) {
        this._bboxText.setRotation(radians);
    }

    update() {
        // Update position
        this._pos.add(this._vel);

        // If the particle is partially offscreen (but not fully), draw two 
        // particles - one that is wrapped around the screen and one that is not.
        this._wrappedPos = this._pos.copy();
        this._xReflectPos = this._pos.copy();
        this._yReflectPos = this._pos.copy();

        // Calculate the positions of the sides of the particle
        var left = this._pos.x - this.halfWidth;
        var right = this._pos.x + this.halfWidth;
        var top = this._pos.y - this.halfHeight;
        var bottom = this._pos.y + this.halfHeight;

        var amountOffscreen, distBeyondWrap;

        // Check if word is offscreen along x-axis
        if (right > this.p.width) {
            amountOffscreen = right - this.p.width;
            if (amountOffscreen > this.width) {
                // Word is completely off the right edge of the screen, so it
                // needs to be wrapped around to the left side of the screen. It is
                // important to account for the "remainder" to get smooth motion:
                // (amountOffscreen - this.width) = distance from left edge of word
                //                                  to the right edge of the screen
                distBeyondWrap = (amountOffscreen - this.width);
                this._pos.x = this.halfWidth + distBeyondWrap;
                // If the particle wraps around the y-axis, we want to keep the x
                // position up to date
                this._wrappedPos.x = this._pos.x;
            }
            else {
                // Word is only partially off the right edge of the screen, so the
                // wrappedPos is going to be used. Project what the position of the
                // particle would be if it were wrapped around the left edge of the
                // screen
                this._wrappedPos.x = -this.halfWidth + amountOffscreen;
                this._xReflectPos.x = -this.halfWidth + amountOffscreen;
            }
        }
        else if (left < 0) {
            amountOffscreen = -left;
            if (amountOffscreen > this.width) {
                // Word is completely off the left edge of the screen, so it needs
                // to be wrapped around to the right side of the screen
                distBeyondWrap = (amountOffscreen - this.width);
                this._pos.x = (this.p.width - this.halfWidth) - distBeyondWrap;
                this._wrappedPos.x = this._pos.x;
            }
            else {
                // Word is only partially off the left edge of the screen
                this._wrappedPos.x = (this.p.width + this.halfWidth) - amountOffscreen;
                this._xReflectPos.x = (this.p.width + this.halfWidth) - amountOffscreen;
            }
        }

        // Check if word is offscreen along y-axis
        if (bottom > this.p.height) {
            amountOffscreen = bottom - this.p.height;
            if (amountOffscreen > this.height) {
                // Word is completely off the bottom edge of the screen, so it
                // needs to be wrapped around to the top side of the screen 
                distBeyondWrap = (amountOffscreen - this.height);
                this._pos.y = this.halfHeight + distBeyondWrap;
                // If the particle wraps around the x-axis, we want to keep the y
                // position up to date
                this._wrappedPos.y = this._pos.y;
            }
            else {
                // Word is only partially off the bottom edge of the screen
                this._wrappedPos.y = -this.halfHeight + amountOffscreen;
                this._yReflectPos.y = -this.halfHeight + amountOffscreen;
            }
        }
        else if (top < 0) {
            amountOffscreen = -top;
            if (amountOffscreen > this.height) {
                // Word is completely off the top edge of the screen, so it needs
                // to be wrapped around to the bottom side of the screen
                distBeyondWrap = (amountOffscreen - this.height);
                this._pos.y = (this.p.height - this.halfHeight) - distBeyondWrap;
                this._wrappedPos.y = this._pos.y;
            }
            else {
                // Word is only partially off the top edge of the screen
                this._wrappedPos.y = (this.p.height + this.halfHeight) - amountOffscreen;
                this._yReflectPos.y = (this.p.height + this.halfHeight) - amountOffscreen;
            }
        }
    }   

    draw() {
        this._bboxText.draw(this._pos.x, this._pos.y, this._rotation);

        if (!this._wrappedPos.equals(this._pos)) {
            // wrappedPos has a different value, so the particle is offscreen       
            this._bboxText.draw(this._wrappedPos.x, this._wrappedPos.y, 
                                this._rotation);
        }
        
        if (this._xReflectPos.x !== this._pos.x) {        
            this._xReflectPos.y = this._pos.y;
            this._bboxText.draw(this._xReflectPos.x, this._xReflectPos.y,
                                this._rotation);
        }

        if (this._yReflectPos.y !== this._pos.y) {        
            this._yReflectPos.x = this._pos.x;
            this._bboxText.draw(this._yReflectPos.x, this._yReflectPos.y, 
                                this._rotation);
        }
    }
}