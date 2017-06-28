import "@algotec/browser-helpers/polyfills";
import {browserType, detectBrowser} from "@algotec/browser-helpers";
import "zone.js/dist/zone";

const browser = detectBrowser();
if ('production' === ENV) {
	// Production
} else {
	if (browser.browserName !== browserType.IE) {
		// Development
		Error.stackTraceLimit = Infinity;
		require('zone.js/dist/long-stack-trace-zone');
	}
}
