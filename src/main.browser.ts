/*
 * Angular bootstraping
 */
import {platformBrowserDynamic} from "@angular/platform-browser-dynamic";
import {decorateModuleRef} from "./app/environment";
import {PackageID, log} from "./app/common/services/log";
import {openMultiMonitorPopup, getMonitorDisplayInfo} from "./app/common/models/monitors.info.token";
import {AppModule} from "./app";
import "./svg-spritemap.loader.js";
/*
 * App Module
 * our top level module that holds all of our components
 */

/*
 * Bootstrap our Angular app with a top level NgModule
 */
export function main(hmrState: any = undefined): Promise<any> {
	return platformBrowserDynamic()
		.bootstrapModule(AppModule)
		.then(decorateModuleRef)
		.catch(err => console.error(err));
}


function doBootstrap() {
	if ('development' === ENV && HMR === true) {
		// activate hot module reload
		let ngrxHmr = require('ngrx-store-hmr/lib/index').hotModuleReplacement;
		ngrxHmr(main, module);
	} else {
		// bootstrap when document is ready
		if (/comp|inter|loaded/.test(document.readyState)) {
			main();
		} else {
			document.addEventListener('DOMContentLoaded', () => main());
		}
	}
}

