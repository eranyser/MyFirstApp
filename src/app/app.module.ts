import {NgModule} from "@angular/core";
import {ENV_PROVIDERS} from "./environment";
import {Http, HttpModule} from "@angular/http";
import {BrowserModule} from "@angular/platform-browser";
import {AppComponent} from './app.component';
/*
 * Platform and Environment providers/directives/pipes
 */


// Application wide providers
const APP_PROVIDERS = [];
export const moduleImports = [
	BrowserModule,
	HttpModule
];

//`AppModule` is the main entry point into Angular2's bootstrapping process

@NgModule({
	declarations: [AppComponent],
	bootstrap: [AppComponent],
	imports: moduleImports,
	providers: [ // expose our Services and Providers into Angular's dependency injection
		...ENV_PROVIDERS, // if provider is different per env
		...APP_PROVIDERS, // 3rd party app wide
		{provide: Window, useValue: window}
	]
})
export class AppModule {
	// constructor(public appRef: ApplicationRef) {}

	hmrOnInit(store) {
		// if (!store ) return;
		// console.log('HMR store', JSON.stringify(store, null, 2));
		// // set state
		// this.appState._state = store;
		// // set input values
		// if ('restoreInputValues' in store) {
		// 	let restoreInputValues = store.restoreInputValues;
		// 	setTimeout(restoreInputValues);
		// }
		//
		// this.appRef.tick();
		// delete store.state;
		// delete store.restoreInputValues;
	}

	// hmrOnDestroy(store) {
	// const cmpLocation = this.appRef.components.map(cmp => cmp.location.nativeElement);
	// // save state
	// const state = this.appState._state;
	// store.state = state;
	// // recreate root elements
	// store.disposeOldHosts = createNewHosts(cmpLocation);
	// // save input values
	// store.restoreInputValues  = createInputTransfer();
	// // remove styles
	// removeNgStyles();
	// }

	// hmrAfterDestroy(store) {
	// // display new elements
	// store.disposeOldHosts();
	// delete store.disposeOldHosts;
	// }

}

