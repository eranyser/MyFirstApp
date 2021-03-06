import {browser, by, element} from 'protractor';

describe('App', () => {

	beforeEach(() => {
		// change hash depending on router LocationStrategy
		browser.get('/#/home');
	});

	it('should have a title', async () => {
		const subject = await browser.getTitle();
		const result = 'Angular2 Webpack Starter by @gdi2290 from @AngularClass';
		expect(subject).toEqual(result);
	});

	it('should have `your content here` x-large', async () => {
		const subject = await element(by.css('[[alg-x-large]]')).getText();
		const result = 'Your Content Here';
		expect(subject).toEqual(result);
	});

});
