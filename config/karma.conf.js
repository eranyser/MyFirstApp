"use strict";
process.on('unhandledRejection', (reason) => {
	console.log(reason.stack);
	console.log('Reason: ' + reason);
});
/**
 * @author: @AngularClass
 */

module.exports = function (config) {
	let args = require('yargs').argv;
	let  coverage = (args.coverage) ? args.coverage : true;
	let path = require('path');
	const testWebpackConfig = require('./webpack.config.js')({env: 'test', coverage});
	coverage = eval(coverage);

	const configuration = {
		basePath: '',
		frameworks: ['jasmine'],
		exclude: [],
		files: [
			{pattern: './dll/*.dll.js', watched: false},
			{pattern: './dll/*.js.map', watched: false, served: true, included: false},
			{pattern: './src/assets/**/*', watched: false, included: false, served: true, nocache: false},
			{pattern: './config/spec-bundle.js', watched: false}

		],
		proxies: {
			"/assets/": "/base/src/assets/"
		},
		preprocessors: {
			'./config/spec-bundle.js': coverage ? ['webpack', 'sourcemap'] : ['webpack', 'sourcemap'],
		},
		specReporter: {
			maxLogLines: 5,
			suppressErrorSummary: false,
			suppressFailed: true,
			suppressPassed: false,
			suppressSkipped: true
		},
		webpack: testWebpackConfig,
		webpackMiddleware: {
			stats: 'errors-only'
		},
		reporters: coverage ? ['mocha', 'junit', 'karma-remap-istanbul'] : ['mocha', 'junit'],
		junitReporter: {
			outputDir: 'coverage',
			// results will be saved as $outputDir/$browserName.xml
			outputFile: 'TEST-results.xml',
			// if included, results will be saved as $outputDir/$browserName/$outputFile
			suite: '',
			// suite will become the package name attribute in xml testsuite element
			useBrowserName: false,
			// add browser name to report and classes names
			nameFormatter: undefined,
			// function (browser, result) to customize the name attribute in xml testcase element
			classNameFormatter: undefined,
			// function (browser, result) to customize the classname attribute in xml testcase element
			properties: {}

			// key value pair of properties to add to the <properties> section of the report
		},
		// web server port
		port: 9876,
		// enable / disable colors in the output (reporters and logs)
		colors: true,

		/*
		 * level of logging
		 * possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
		 */
		logLevel: config.LOG_INFO,
		// enable / disable watching file and executing tests whenever any file changes
		autoWatch: false,

		/*
		 * start these browsers
		 * available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
		 */

		browsers: ['ChromeNoSandbox'],
		customLaunchers: {
			ChromeNoSandbox: {
				base: 'Chrome',
				flags: ['--no-sandbox']
			}
		},
		/*
		 * Continuous Integration mode
		 * if true, Karma captures browsers, runs the tests and exits
		 */
		singleRun: true
	};

	if (coverage) {
		Object.assign(config, {
			remapIstanbulReporter: {
				remapOptions: {basePath:path.resolve('../src')}, //additional remap options
				reportOptions: {}, //additional report options
				reports: {
					html: 'coverage/html'
				}
			},
			// coverageReporter: {
			// 	type: 'in-memory'
			// },
			// remapCoverageReporter: {
			// 	'text-summary': null,
			// 	json: './coverage/coverage.json',
			// 	html: './coverage/html'
			// },
			//  remapOptions: {
			//  	basePath: path.resolve('../src/app')
			//  },
		});
	}
	if (process.env.TRAVIS) {
		configuration.browsers = [
			'ChromeTravisCi'
		];
	}

	config.set(configuration);
};
