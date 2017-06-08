module.exports = {
	polyfills: [
		'@algotec/browser-helpers',
		'@algotec/browser-helpers/polyfills',
		'zone.js'
	],
	vendor: [
		'@angular/platform-browser',
		'@angular/platform-browser-dynamic',
		'@angular/core',
		'@angular/common',
		'@angular/compiler',
		'@angular/forms',
		'@angular/http',
		"rxjs",
		'@angularclass/hmr',
		"tslib",
		"hammerjs",
	]
};
