/*
 * Angular 2 decorators and services
 */
import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {AppState} from './app.service';

/*
 * App Component
 * Top Level Component
 */
@Component({
	selector: 'alg-app',
	encapsulation: ViewEncapsulation.None,
	styleUrls: [
		'./app.component.css'
	],
	template: `
		<nav>
			<a [routerLink]="['./']" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}">Index</a>
			<a [routerLink]="['./home']" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}">Home</a>
			<a [routerLink]="['./detail']" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}">Detail</a>
			<a [routerLink]="['./barrel']" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}">Barrel</a>
			<a [routerLink]="['./about']" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}">About</a>
		</nav>
		<main>
			<router-outlet></router-outlet>
		</main>
		<pre class="app-state">this.appState.state = {{ appState.state | json }}</pre>
		<footer>
			<span>Angular App starter <a [href]="url">@Algotec</a></span>
			<div>
				<a [href]="url">
					<img [src]="logo" width="25%">
				</a>
			</div>
		</footer>
	`
})
export class AppComponent implements OnInit {
	public logo = 'assets/img/carestream_logo.png';
	public name = 'Angular App Base @Algotec';
	public url = 'http://git-srv:8080/tfs/DefaultCollection/web-common/_git/angular-app-base';

	constructor(public appState: AppState) {}

	public ngOnInit() {
		console.log('Initial App State', this.appState.state);
	}

}

/*
 * Please review the https://github.com/AngularClass/angular2-examples/ repo for
 * more angular app examples that you may copy/paste
 * (The examples may not be updated as quickly. Please open an issue on github for us to update it)
 * For help or questions please contact us at @AngularClass on twitter
 * or our chat on Slack at https://AngularClass.com/slack-join
 */
