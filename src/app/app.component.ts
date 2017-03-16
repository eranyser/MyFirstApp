import {Component, ChangeDetectionStrategy} from '@angular/core';

@Component({
	selector: 'alg-app',
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `<h1>Hello {{target}}</h1>`
})
export class AppComponent {
	target = 'world';
}
