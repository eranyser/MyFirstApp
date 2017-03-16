import "core-js/es6/object";
import "core-js/es6/symbol";
import "core-js/es6/function";
import "core-js/es6/parse-int";
import "core-js/es6/parse-float";
import "core-js/es6/number";
import "core-js/es6/math";
import "core-js/es6/string";
import "core-js/es6/date";
import "core-js/es6/array";
import "core-js/es6/regexp";
import "core-js/es6/map";
import "core-js/es6/set";
import "core-js/es6/weak-map";
import "core-js/es6/weak-set";
import "core-js/es6/typed";
import "core-js/es6/reflect";
import "core-js/es7/reflect";
import "core-js/es7/object";
import "regenerator-runtime/runtime";
import "zone.js/dist/zone";
if (typeof window !== 'undefined') { //not in worker
	require("web-animations-js");
}

if (navigator.appName === 'Microsoft Internet Explorer' || !!(navigator.userAgent.match(/Trident/) || navigator.userAgent.match(/rv:11/))
	&& typeof window !== 'undefined') { // add ie-shim  but not in worker
	console.log('adding IE shim!');
	require('ie-shim');
}


if ('production' === ENV) {
	// Production
} else {
	// Development
	Error.stackTraceLimit = Infinity;
	require('zone.js/dist/long-stack-trace-zone');
}

