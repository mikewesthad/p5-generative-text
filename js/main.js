!function t(e,i,s){function o(h,r){if(!i[h]){if(!e[h]){var a="function"==typeof require&&require;if(!r&&a)return a(h,!0);if(n)return n(h,!0);var c=new Error("Cannot find module '"+h+"'");throw c.code="MODULE_NOT_FOUND",c}var d=i[h]={exports:{}};e[h][0].call(d.exports,function(t){var i=e[h][1][t];return o(i?i:t)},d,d.exports,t,e,i,s)}return i[h].exports}for(var n="function"==typeof require&&require,h=0;h<s.length;h++)o(s[h]);return o}({1:[function(t,e,i){function s(t,e,i,o){this._font=t,this._text=e,this._fontSize=void 0!==i?i:12,this.p=o||window,this._rotation=0,this._hAlign=s.ALIGN.BOX_CENTER,this._vAlign=s.BASELINE.BOX_CENTER,this._calculateMetrics(!0)}e.exports=s,s.ALIGN={BOX_LEFT:"box_left",BOX_CENTER:"box_center",BOX_RIGHT:"box_right"},s.BASELINE={BOX_TOP:"box_top",BOX_CENTER:"box_center",BOX_BOTTOM:"box_bottom",FONT_CENTER:"font_center",ALPHABETIC:"alphabetic"},s.prototype.setText=function(t){this._text=t,this._calculateMetrics(!1)},s.prototype.setTextSize=function(t){this._fontSize=t,this._calculateMetrics(!0)},s.prototype.setRotation=function(t){this._rotation=t},s.prototype.setAnchor=function(t,e){this._hAlign=t||s.ALIGN.CENTER,this._vAlign=e||s.BASELINE.CENTER},s.prototype.getBbox=function(t,e){var i=this._calculateAlignedCoords(t,e);return{x:i.x+this._boundsOffset.x,y:i.y+this._boundsOffset.y,w:this.width,h:this.height}},s.prototype.draw=function(t,e,i){i=i||!1;var s={x:void 0!==t?t:0,y:void 0!==e?e:0};if(this.p.push(),this._rotation&&(s=this._calculateRotatedCoords(s.x,s.y,this._rotation),this.p.rotate(this._rotation)),s=this._calculateAlignedCoords(s.x,s.y),this.p.textAlign(this.p.LEFT,this.p.BASELINE),this.p.textFont(this._font),this.p.textSize(this._fontSize),this.p.text(this._text,s.x,s.y),i){this.p.stroke(200);var o=s.x+this._boundsOffset.x,n=s.y+this._boundsOffset.y;this.p.noFill(),this.p.rect(o,n,this.width,this.height)}this.p.pop()},s.prototype._calculateRotatedCoords=function(t,e,i){var s=Math.cos(i)*t+Math.cos(Math.PI/2-i)*e,o=-Math.sin(i)*t+Math.sin(Math.PI/2-i)*e;return{x:s,y:o}},s.prototype._calculateAlignedCoords=function(t,e){var i,o;switch(this._hAlign){case s.ALIGN.BOX_LEFT:i=t;break;case s.ALIGN.BOX_CENTER:i=t-this.halfWidth;break;case s.ALIGN.BOX_RIGHT:i=t-this.width;break;default:i=t,console.log("Unrecognized horizonal align:",this._hAlign)}switch(this._vAlign){case s.BASELINE.BOX_TOP:o=e-this._boundsOffset.y;break;case s.BASELINE.BOX_CENTER:o=e+this._distBaseToMid;break;case s.BASELINE.BOX_BOTTOM:o=e-this._distBaseToBottom;break;case s.BASELINE.FONT_CENTER:o=e-this._descent+(this._ascent+this._descent)/2;break;case s.BASELINE.ALPHABETIC:o=e;break;default:o=e,console.log("Unrecognized vertical align:",this._vAlign)}return{x:i,y:o}},s.prototype._calculateMetrics=function(t){var e=this._font.textBounds(this._text,1e3,1e3,this._fontSize);e={x:e.x-1e3,y:e.y-1e3,w:e.w,h:e.h},t&&(this._ascent=this._font._textAscent(this._fontSize),this._descent=this._font._textDescent(this._fontSize)),this.width=e.w,this.height=e.h,this.halfWidth=this.width/2,this.halfHeight=this.height/2,this._boundsOffset={x:e.x,y:e.y},this._distBaseToMid=Math.abs(e.y)-this.halfHeight,this._distBaseToBottom=this.height-Math.abs(e.y)}},{}],2:[function(t,e,i){function s(t,e,i,s,o){this.p=t,this.min=void 0!==e?e:0,this.max=void 0!==i?i:1,this.increment=void 0!==s?s:.1,this.position=void 0!==o?o:t.random(-1e6,1e6)}function o(t,e,i,o,n,h,r,a,c){this.xNoise=new s(t,e,i,h,a),this.yNoise=new s(t,o,n,r,c),this.p=t}e.exports={NoiseGenerator1D:s,NoiseGenerator2D:o},s.prototype.setBounds=function(t,e){void 0!==t&&(this.min=t),void 0!==e&&(this.max=e)},s.prototype.setIncrement=function(t){void 0!==t&&(this.increment=t)},s.prototype.generate=function(){this._update();var t=this.p.noise(this.position);return t=this.p.map(t,0,1,this.min,this.max)},s.prototype._update=function(){this.position+=this.increment},o.prototype.setBounds=function(t){t&&(void 0!==t.xMin&&(this.xMin=t.xMin),void 0!==t.xMax&&(this.xMax=t.xMax),void 0!==t.yMin&&(this.yMin=t.yMin),void 0!==t.yMax&&(this.yMax=t.yMax))},o.prototype.setBounds=function(t){t&&(void 0!==t.xIncrement&&this.xNoise.setIncrement(t.xIncrement),void 0!==t.yIncrement&&this.yNoise.setIncrement(t.yIncrement))},o.prototype.generate=function(){return{x:this.xNoise.generate(),y:this.yNoise.generate()}}},{}],3:[function(t,e,i){function s(t,e,i,s,o){this.p=t,this.min=void 0!==e?e:0,this.max=void 0!==i?i:1,this.increment=void 0!==s?s:.1,this.angle=void 0!==o?o:t.random(-1e6,1e6)}e.exports=s,s.prototype.setBounds=function(t,e){void 0!==t&&(this.min=t),void 0!==e&&(this.max=e)},s.prototype.setIncrement=function(t){void 0!==t&&(this.increment=t)},s.prototype.generate=function(){this._update();var t=this.p.sin(this.angle);return t=this.p.map(t,-1,1,this.min,this.max)},s.prototype._update=function(){this.angle+=this.increment}},{}],4:[function(t,e,i){t("./sketches/noisy-word.js")(),t("./sketches/halftone-flashlight-word.js")(),t("./sketches/word-particle-wrapping.js")()},{"./sketches/halftone-flashlight-word.js":6,"./sketches/noisy-word.js":7,"./sketches/word-particle-wrapping.js":8}],5:[function(t,e,i){function s(t,e,i,s,n,h){this.p=t,this._pos=n,this._vel=h,this._rotation=0,this._bboxText=new o(e,s,i,t),this._bboxText.setAnchor(o.ALIGN.BOX_CENTER,o.BASELINE.BOX_CENTER);var r=this._bboxText.getBbox(this._pos.x,this._pos.y);this.width=r.w,this.halfWidth=r.w/2,this.height=r.h,this.halfHeight=r.h/2,this._wrappedPos=null,this._xReflectPos=null,this._yReflectPos=null}e.exports=s;var o=t("p5-bbox-aligned-text");s.prototype.setVelocity=function(t){this._vel.x=t.x,this._vel.y=t.y},s.prototype.setRotation=function(t){this._bboxText.setRotation(t)},s.prototype.update=function(){this._pos.add(this._vel),this._wrappedPos=this._pos.copy(),this._xReflectPos=this._pos.copy(),this._yReflectPos=this._pos.copy();var t,e,i=this._pos.x-this.halfWidth,s=this._pos.x+this.halfWidth,o=this._pos.y-this.halfHeight,n=this._pos.y+this.halfHeight;s>this.p.width?(t=s-this.p.width,t>this.width?(e=t-this.width,this._pos.x=this.halfWidth+e,this._wrappedPos.x=this._pos.x):(this._wrappedPos.x=-this.halfWidth+t,this._xReflectPos.x=-this.halfWidth+t)):0>i&&(t=-i,t>this.width?(e=t-this.width,this._pos.x=this.p.width-this.halfWidth-e,this._wrappedPos.x=this._pos.x):(this._wrappedPos.x=this.p.width+this.halfWidth-t,this._xReflectPos.x=this.p.width+this.halfWidth-t)),n>this.p.height?(t=n-this.p.height,t>this.height?(e=t-this.height,this._pos.y=this.halfHeight+e,this._wrappedPos.y=this._pos.y):(this._wrappedPos.y=-this.halfHeight+t,this._yReflectPos.y=-this.halfHeight+t)):0>o&&(t=-o,t>this.height?(e=t-this.height,this._pos.y=this.p.height-this.halfHeight-e,this._wrappedPos.y=this._pos.y):(this._wrappedPos.y=this.p.height+this.halfHeight-t,this._yReflectPos.y=this.p.height+this.halfHeight-t))},s.prototype.draw=function(){this._bboxText.draw(this._pos.x,this._pos.y,this._rotation),this._wrappedPos.equals(this._pos)||this._bboxText.draw(this._wrappedPos.x,this._wrappedPos.y,this._rotation),this._xReflectPos.x!==this._pos.x&&(this._xReflectPos.y=this._pos.y,this._bboxText.draw(this._xReflectPos.x,this._xReflectPos.y,this._rotation)),this._yReflectPos.y!==this._pos.y&&(this._yReflectPos.x=this._pos.x,this._bboxText.draw(this._yReflectPos.x,this._yReflectPos.y,this._rotation))}},{"p5-bbox-aligned-text":1}],6:[function(t,e,i){function s(){var t="halftone-flashlight-word",e=document.getElementById("sketches");p.createElement("div",{id:t},e);new p5(function(t){r=t,r.preload=o,r.setup=n,r.draw=h},t)}function o(){a=r.loadFont(y)}function n(){var t=r.createCanvas(x.width,x.height);t.canvas.addEventListener("mouseover",function(){u=!0}),t.canvas.addEventListener("mouseout",function(){u=!1}),r.background(255),r.textSize(g),d=new l(a,_,g,r),d.setAnchor(l.ALIGN.BOX_CENTER,l.BASELINE.FONT_CENTER),r.noStroke(),r.fill("#0A000A"),d.draw(r.width/2,r.height/2);var e=d.getBbox(r.width/2,r.height/2),i=Math.floor(Math.max(e.x-5,0)),s=Math.ceil(Math.min(e.x+e.w+5,r.width)),o=Math.floor(Math.max(e.y-5,0)),n=Math.ceil(Math.min(e.y+e.h+5,r.height)),h=5;r.loadPixels(),r.pixelDensity(1),c=[];for(var p=o;n>p;p+=h)for(var f=i;s>f;f+=h){var y=4*(p*r.width+f),w=r.pixels[y],v=r.pixels[y+1],E=r.pixels[y+2],m=r.pixels[y+3],b=r.color(w,v,E,m);r.saturation(b)>0&&(c.push({x:f+r.random(-2/3*h,2/3*h),y:p+r.random(-2/3*h,2/3*h),color:r.color("#06FFFF")}),c.push({x:f+r.random(-2/3*h,2/3*h),y:p+r.random(-2/3*h,2/3*h),color:r.color("#FE00FE")}),c.push({x:f+r.random(-2/3*h,2/3*h),y:p+r.random(-2/3*h,2/3*h),color:r.color("#FFFF04")}))}r.updatePixels()}function h(){if(u){f&&(r.background(255),f=!1),r.blendMode(r.BLEND),r.background(255),r.noStroke(),r.blendMode(r.MULTIPLY);for(var t=0;t<c.length;t+=1){var e=c[t],i=e.color,s=r.dist(e.x,e.y,r.mouseX,r.mouseY),o=r.map(s,0,150,1,10);r.fill(i),r.ellipse(e.x,e.y,o,o)}}}e.exports=s;var r,a,c,d,p=t("../utilities/dom-utilities.js"),l=(t("../generators/noise-generators.js"),t("p5-bbox-aligned-text")),f=!0,u=!1,x={width:400,height:150},_="halftone",g=150,y="./assets/fonts/leaguegothic-regular-webfont.ttf"},{"../generators/noise-generators.js":2,"../utilities/dom-utilities.js":9,"p5-bbox-aligned-text":1}],7:[function(t,e,i){function s(){var t="noisy-word",e=document.getElementById("sketches");p.createElement("div",{id:t},e);new p5(function(t){r=t,r.preload=o,r.setup=n,r.draw=h},t)}function o(){a=r.loadFont(y)}function n(){var t=r.createCanvas(x.width,x.height);t.canvas.addEventListener("mouseover",function(){u=!0}),t.canvas.addEventListener("mouseout",function(){u=!1}),r.background(255),r.textFont(a),r.textSize(g),r.textAlign(r.CENTER,r.CENTER),r.stroke(255),r.fill("#0A000A"),r.strokeWeight(2),r.text(_,r.width/2,r.height/2),c=new l.NoiseGenerator1D(r,-r.PI/4,r.PI/4,.02),d=new l.NoiseGenerator2D(r,-100,100,-50,50,.01,.01)}function h(){if(u){f&&(r.background(255),f=!1);var t=c.generate(),e=d.generate();r.push(),r.translate(r.width/2+e.x,r.height/2+e.y),r.rotate(t),r.text(_,0,0),r.pop()}}e.exports=s;var r,a,c,d,p=t("../utilities/dom-utilities.js"),l=t("../generators/noise-generators.js"),f=!0,u=!1,x={width:400,height:150},_="Squiggle",g=100,y="./assets/fonts/leaguegothic-regular-webfont.ttf"},{"../generators/noise-generators.js":2,"../utilities/dom-utilities.js":9}],8:[function(t,e,i){function s(){var t="word-particle-wrapping",e=document.getElementById("sketches");p.createElement("div",{id:t},e);new p5(function(t){r=t,r.preload=o,r.setup=n,r.draw=h},t)}function o(){a=r.loadFont(v)}function n(){var t=r.createCanvas(g.width,g.height);t.canvas.addEventListener("mouseover",function(){_=!0}),t.canvas.addEventListener("mouseout",function(){_=!1}),r.background(255),r.textFont(a),r.textSize(w),r.textAlign(r.CENTER,r.CENTER),r.stroke(255),r.fill("#00ACE0"),r.strokeWeight(2),r.text(y,r.width/2,r.height/2);var e=r.createVector(r.width/2,r.height/2),i=r.createVector(3,-1);c=new u(r,a,w,y,e,i),d=new f(r,-Math.PI/5,Math.PI/5,.06),directionGenerator=new l.NoiseGenerator1D(r,0,r.TWO_PI,.005)}function h(){if(_){x&&(r.background(255),x=!1);var t=directionGenerator.generate();c.setVelocity({x:1.25*r.cos(t),y:1.25*r.sin(t)});var e=d.generate();c.setRotation(e),c.update(),r.fill("#00ACE0"),r.stroke(255),r.strokeWeight(1),c.draw()}}e.exports=s;var r,a,c,d,p=t("../utilities/dom-utilities.js"),l=t("../generators/noise-generators.js"),f=t("../generators/sin-generator.js"),u=t("../particles/text-particle.js"),x=!0,_=!1,g={width:400,height:150},y="Ripple",w=50,v="./assets/fonts/leaguegothic-regular-webfont.ttf"},{"../generators/noise-generators.js":2,"../generators/sin-generator.js":3,"../particles/text-particle.js":5,"../utilities/dom-utilities.js":9}],9:[function(t,e,i){e.exports.forEachInObject=function(t,e){if(t)for(var i in t)t.hasOwnProperty(i)&&e(i,t[i],t)},e.exports.createElement=function(t,e,i){var s=document.createElement(t);return e&&(e.textContent&&(s.textContent=e.textContent),e.id&&(s.id=e.id),e.className&&(s.className=e.className),e.style&&addStyle(s,e.style),e.attributes&&addAttributes(s,e.attributes)),i&&i.appendChild(s),s},e.exports.addStyle=function(t,e){e&&forEachInObject(e,function(e,i){t.style[e]=i})},e.exports.addAttributes=function(t,e){e&&forEachInObject(e,function(e,i){t[e]=i})},e.exports.removeElement=function(t){t.parentElement.removeChild(t)}},{}]},{},[4]);
//# sourceMappingURL=main/main.js.map
