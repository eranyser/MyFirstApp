/*
 * Angular bootstraping
 */
import {platformBrowserDynamic} from "@angular/platform-browser-dynamic";
import {decorateModuleRef} from "./app/environment";
import {PackageID, log} from "./app/common/services/log";
import {bootloader} from '@angularclass/hmr';
import {AppModule} from "./app";
// import "./svg-spritemap.loader.js"; /// this allows for SVG icons
/*
 * App Module
 * our top level module that holds all of our components
 */

/*
 * Bootstrap our Angular app with a top level NgModule
 */


export function main(): Promise<any> {
	return platformBrowserDynamic()
		.bootstrapModule(AppModule)
		.then(decorateModuleRef)
		.catch((err) => console.error(err));
}

// needed for hmr
// in prod this is replace for document ready
bootloader(main);
