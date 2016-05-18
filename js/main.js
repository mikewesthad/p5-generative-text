!function t(e,i,o){function n(r,a){if(!i[r]){if(!e[r]){var h="function"==typeof require&&require;if(!a&&h)return h(r,!0);if(s)return s(r,!0);var c=new Error("Cannot find module '"+r+"'");throw c.code="MODULE_NOT_FOUND",c}var d=i[r]={exports:{}};e[r][0].call(d.exports,function(t){var i=e[r][1][t];return n(i?i:t)},d,d.exports,t,e,i,o)}return i[r].exports}for(var s="function"==typeof require&&require,r=0;r<o.length;r++)n(o[r]);return n}({1:[function(t,e,i){function o(t,e,i,n){this._font=t,this._text=e,this._fontSize=void 0!==i?i:12,this.p=n||window,this._rotation=0,this._hAlign=o.ALIGN.CENTER,this._vAlign=o.BASELINE.CENTER,this._calculateMetrics(!0)}e.exports=o,o.ALIGN={LEFT:"left",CENTER:"center",RIGHT:"right"},o.BASELINE={BOX_TOP:"top",BOX_CENTER:"center",BOM_BOTTOM:"bottom",FONT_CENTER:"font_center",ALPHABETIC:"alphabetic"},o.prototype.setText=function(t){this._text=t,this._calculateMetrics(!1)},o.prototype.setTextSize=function(t){this._fontSize=t,this._calculateMetrics(!0)},o.prototype.setRotation=function(t){this._rotation=t},o.prototype.setAnchor=function(t,e){this._hAlign=t||o.ALIGN.CENTER,this._vAlign=e||o.BASELINE.CENTER},o.prototype.getBbox=function(t,e){var i=this._calculateAlignedCoords(t,e);return{x:i.x+this._boundsOffset.x,y:i.y+this._boundsOffset.y,w:this.width,h:this.height}},o.prototype.draw=function(t,e,i){i=i||!1;var o={x:void 0!==t?t:0,y:void 0!==e?e:0};if(this.p.push(),this._rotation&&(o=this._calculateRotatedCoords(o.x,o.y,this._rotation),this.p.rotate(this._rotation)),o=this._calculateAlignedCoords(o.x,o.y),this.p.textAlign(this.p.LEFT,this.p.BASELINE),this.p.textFont(this._font),this.p.textSize(this._fontSize),this.p.text(this._text,o.x,o.y),i){this.p.stroke(200);var n=o.x+this._boundsOffset.x,s=o.y+this._boundsOffset.y;this.p.noFill(),this.p.rect(n,s,this.width,this.height)}this.p.pop()},o.prototype._calculateRotatedCoords=function(t,e,i){var o=Math.cos(i)*t+Math.cos(Math.PI/2-i)*e,n=-Math.sin(i)*t+Math.sin(Math.PI/2-i)*e;return{x:o,y:n}},o.prototype._calculateAlignedCoords=function(t,e){var i,n;switch(this._hAlign){case o.ALIGN.LEFT:i=t;break;case o.ALIGN.CENTER:i=t-this.halfWidth;break;case o.ALIGN.RIGHT:i=t-this.width;break;default:i=t,console.log("Unrecognized horizonal align:",this._hAlign)}switch(this._vAlign){case o.BASELINE.TOP:n=e-this._boundsOffset.y;break;case o.BASELINE.CENTER:n=e+this._distBaseToMid;break;case o.BASELINE.BOTTOM:n=e-this._distBaseToBottom;break;case o.BASELINE.FONT_CENTER:n=e-this._descent+(this._ascent+this._descent)/2;break;case o.BASELINE.ALPHABETIC:n=e;break;default:n=e,console.log("Unrecognized vertical align:",this._vAlign)}return{x:i,y:n}},o.prototype._calculateMetrics=function(t){var e=this._font.textBounds(this._text,1e3,1e3,this._fontSize);e.x-=1e3,e.y-=1e3,t&&(this._ascent=this._font._textAscent(this._fontSize),this._descent=this._font._textDescent(this._fontSize)),this.width=e.w,this.height=e.h,this.halfWidth=this.width/2,this.halfHeight=this.height/2,this._boundsOffset={x:e.x,y:e.y},this._distBaseToMid=Math.abs(e.y)-this.halfHeight,this._distBaseToBottom=this.height-Math.abs(e.y)}},{}],2:[function(t,e,i){function o(t,e,i,o,n){this.p=t,this.min=void 0!==e?e:0,this.max=void 0!==i?i:1,this.increment=void 0!==o?o:.1,this.position=void 0!==n?t.random(-1e6,1e6):0}function n(t,e,i,n,s,r,a,h,c){this.xNoise=new o(t,e,i,r,h),this.yNoise=new o(t,n,s,a,c),this.p=t}e.exports={NoiseGenerator1D:o,NoiseGenerator2D:n},o.prototype.setBounds=function(t,e){void 0!==t&&(this.min=t),void 0!==e&&(this.max=e)},o.prototype.setIncrement=function(t){void 0!==t&&(this.increment=t)},o.prototype.generate=function(){this._update();var t=this.p.noise(this.position);return t=this.p.map(t,0,1,this.min,this.max)},o.prototype._update=function(){this.position+=this.increment},n.prototype.setBounds=function(t){t&&(void 0!==t.xMin&&(this.xMin=t.xMin),void 0!==t.xMax&&(this.xMax=t.xMax),void 0!==t.yMin&&(this.yMin=t.yMin),void 0!==t.yMax&&(this.yMax=t.yMax))},n.prototype.setBounds=function(t){t&&(void 0!==t.xIncrement&&this.xNoise.setIncrement(t.xIncrement),void 0!==t.yIncrement&&this.yNoise.setIncrement(t.yIncrement))},n.prototype.generate=function(){return{x:this.xNoise.generate(),y:this.yNoise.generate()}}},{}],3:[function(t,e,i){t("./sketches/noisy-word.js")(),t("./sketches/halftone-flashlight-word.js")()},{"./sketches/halftone-flashlight-word.js":4,"./sketches/noisy-word.js":5}],4:[function(t,e,i){function o(){var t="halftone-flashlight-word",e=document.getElementById("sketches");l.createElement("div",{id:t},e);new p5(function(t){a=t,a.preload=n,a.setup=s,a.draw=r},t)}function n(){h=a.loadFont(y)}function s(){var t=a.createCanvas(x.width,x.height);t.canvas.addEventListener("mouseover",function(){p=!0}),t.canvas.addEventListener("mouseout",function(){p=!1}),a.background(255),a.textSize(E),d=new u(h,g,E,a),d.setAnchor(u.ALIGN.CENTER,u.BASELINE.FONT_CENTER),a.noStroke(),a.fill("#0A000A"),d.draw(a.width/2,a.height/2);var e=d.getBbox(a.width/2,a.height/2),i=Math.floor(Math.max(e.x-5,0)),o=Math.ceil(Math.min(e.x+e.w+5,a.width)),n=Math.floor(Math.max(e.y-5,0)),s=Math.ceil(Math.min(e.y+e.h+5,a.height)),r=5;a.loadPixels(),a.pixelDensity(1),c=[];for(var l=n;s>l;l+=r)for(var f=i;o>f;f+=r){var y=4*(l*a.width+f),_=a.pixels[y],v=a.pixels[y+1],m=a.pixels[y+2],N=a.pixels[y+3],w=a.color(_,v,m,N);a.saturation(w)>0&&(c.push({x:f+a.random(-2/3*r,2/3*r),y:l+a.random(-2/3*r,2/3*r),color:a.color("#06FFFF")}),c.push({x:f+a.random(-2/3*r,2/3*r),y:l+a.random(-2/3*r,2/3*r),color:a.color("#FE00FE")}),c.push({x:f+a.random(-2/3*r,2/3*r),y:l+a.random(-2/3*r,2/3*r),color:a.color("#FFFF04")}))}a.updatePixels()}function r(){if(p){f&&(a.background(255),f=!1),a.blendMode(a.BLEND),a.background(255),a.noStroke(),a.blendMode(a.MULTIPLY);for(var t=0;t<c.length;t+=1){var e=c[t],i=e.color,o=a.dist(e.x,e.y,a.mouseX,a.mouseY),n=a.map(o,0,150,1,10);a.fill(i),a.ellipse(e.x,e.y,n,n)}}}e.exports=o;var a,h,c,d,l=t("../utilities/dom-utilities.js"),u=(t("../generators/noise-generators.js"),t("p5-bbox-aligned-text")),f=!0,p=!1,x={width:400,height:150},g="halftone",E=150,y="./assets/fonts/leaguegothic-regular-webfont.ttf"},{"../generators/noise-generators.js":2,"../utilities/dom-utilities.js":6,"p5-bbox-aligned-text":1}],5:[function(t,e,i){function o(){var t="noisy-word",e=document.getElementById("sketches");l.createElement("div",{id:t},e);new p5(function(t){a=t,a.preload=n,a.setup=s,a.draw=r},t)}function n(){h=a.loadFont(y)}function s(){var t=a.createCanvas(x.width,x.height);t.canvas.addEventListener("mouseover",function(){p=!0}),t.canvas.addEventListener("mouseout",function(){p=!1}),a.background(255),a.textFont(h),a.textSize(E),a.textAlign(a.CENTER,a.CENTER),a.stroke(255),a.fill("#0A000A"),a.strokeWeight(2),a.text(g,a.width/2,a.height/2),c=new u.NoiseGenerator1D(a,-a.PI/4,a.PI/4,.02),d=new u.NoiseGenerator2D(a,-100,100,-50,50,.01,.01)}function r(){if(p){f&&(a.background(255),f=!1);var t=c.generate(),e=d.generate();a.push(),a.translate(a.width/2+e.x,a.height/2+e.y),a.rotate(t),a.text(g,0,0),a.pop()}}e.exports=o;var a,h,c,d,l=t("../utilities/dom-utilities.js"),u=t("../generators/noise-generators.js"),f=!0,p=!1,x={width:400,height:150},g="Squiggle",E=100,y="./assets/fonts/leaguegothic-regular-webfont.ttf"},{"../generators/noise-generators.js":2,"../utilities/dom-utilities.js":6}],6:[function(t,e,i){e.exports.forEachInObject=function(t,e){if(t)for(var i in t)t.hasOwnProperty(i)&&e(i,t[i],t)},e.exports.createElement=function(t,e,i){var o=document.createElement(t);return e&&(e.textContent&&(o.textContent=e.textContent),e.id&&(o.id=e.id),e.className&&(o.className=e.className),e.style&&addStyle(o,e.style),e.attributes&&addAttributes(o,e.attributes)),i&&i.appendChild(o),o},e.exports.addStyle=function(t,e){e&&forEachInObject(e,function(e,i){t.style[e]=i})},e.exports.addAttributes=function(t,e){e&&forEachInObject(e,function(e,i){t[e]=i})},e.exports.removeElement=function(t){t.parentElement.removeChild(t)}},{}]},{},[3]);
//# sourceMappingURL=main/main.js.map
