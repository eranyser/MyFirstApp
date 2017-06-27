import "@algotec/browser-helpers/polyfills";
import {BrowserHelpers} from "@algotec/browser-helpers";
import "zone.js/dist/zone";

const browser = BrowserHelpers.detectBrowser();
if ('production' === ENV) {
	// Production
} else {
	if (browser.browserName !== BrowserHelpers.browserType.IE) {
		// Development
		Error.stackTraceLimit = Infinity;
		require('zone.js/dist/long-stack-trace-zone');
	}
}
