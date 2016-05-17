module.exports.forEachInObject = function (object, iterationFunction) {
	if (!object) return;
	for (var key in object) {
		if (!object.hasOwnProperty(key)) continue;
		iterationFunction(key, object[key], object);
	}
};

module.exports.createElement = function (tagName, parameters, parent) {
	var el = document.createElement(tagName);
	if (parameters) {
		if (parameters.textContent) el.textContent = parameters.textContent;
		if (parameters.id) el.id = parameters.id;
		if (parameters.className) el.className = parameters.className;
		if (parameters.style) addStyle(el, parameters.style);
		if (parameters.attributes) addAttributes(el, parameters.attributes);
	}	
	if (parent) parent.appendChild(el);
	return el;
};

module.exports.addStyle = function (element, style) {
	if (!style) return;
	forEachInObject(style, function (key, val) {
		element.style[key] = val;
	});	
};

module.exports.addAttributes = function (element, attributes) {
	if (!attributes) return;
	forEachInObject(attributes, function (key, val) {
		element[key] = val;
	});	
};

module.exports.removeElement = function (element) {
	element.parentElement.removeChild(element);
};