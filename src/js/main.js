// require("./sketches/noisy-word.js")();
// require("./sketches/halftone-flashlight-word.js")();
// require("./sketches/word-particle-wrapping.js")();
// require("./sketches/fleeing-halftones.js")();
// require("./sketches/connect-points-words.js")();

import RevealSketch from "./sketches/line-reveal.js";
import RevealParticlesSketch from "./sketches/line-reveal-particles";
import ConnectPointsSketch from "./sketches/connect-points-words";
import FleeingSketch from "./sketches/fleeing-halftones";
import NoisyWordSketch from "./sketches/noisy-word";
import WrappingSketch from "./sketches/word-particle-wrapping";
import FlashlightSketch from "./sketches/halftone-flashlight-word";

const sketchContainer = document.getElementById("sketches");

const createDiv = (parent) => {
    const div = document.createElement("div");
    parent.appendChild(div);
    return div;
}

// Add each sketch to a div - that way they get added in the order specified here, rather than the 
// order each sketch gets async loaded
new NoisyWordSketch(createDiv(sketchContainer));
new FlashlightSketch(createDiv(sketchContainer));
new WrappingSketch(createDiv(sketchContainer));
new FleeingSketch(createDiv(sketchContainer));
new RevealSketch(createDiv(sketchContainer));
new RevealParticlesSketch(createDiv(sketchContainer));
new ConnectPointsSketch(createDiv(sketchContainer));

