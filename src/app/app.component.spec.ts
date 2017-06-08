import {NO_ERRORS_SCHEMA} from '@angular/core';
import {async, ComponentFixture, TestBed} from '@angular/core/testing';
// Load the implementations that should be tested
import {AppComponent} from './app.component';
import {AppState} from './app.service';

describe(`App`, () => {
	let comp: AppComponent;
	let fixture: ComponentFixture<AppComponent>;

	// async beforeEach
	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [AppComponent],
			schemas: [NO_ERRORS_SCHEMA],
			providers: [AppState]
		})
			.compileComponents(); // compile template and css
	}));

	// synchronous beforeEach
	beforeEach(() => {
		fixture = TestBed.createComponent(AppComponent);
		comp = fixture.componentInstance;

		fixture.detectChanges(); // trigger initial data binding
	});

	it(`should be readly initialized`, () => {
		expect(fixture).toBeDefined();
		expect(comp).toBeDefined();
	});

	it(`should be @Algotec`, () => {
		expect(comp.url).toEqual('http://git-srv:8080/tfs/DefaultCollection/web-common/_git/angular-app-base');
		expect(comp.logo).toEqual('assets/img/carestream_logo.png');
		expect(comp.name).toEqual('Angular App Base @Algotec');
	});

	it('should log ngOnInit', () => {
		spyOn(console, 'log');
		expect(console.log).not.toHaveBeenCalled();

		comp.ngOnInit();
		expect(console.log).toHaveBeenCalled();
	});

});
