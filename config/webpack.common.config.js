const helpers = require("./helpers.js");

module.exports = function (options) {
	const AOT = helpers.getOption('AOT', options, false);
	const ENV = options.env || process.env.NODE_ENV || 'development';
	return {
		devtool: (ENV === 'production') ? 'source-map' : 'inline-source-map',
		entry: {
			'polyfills': './src/polyfills.browser.ts',
			'vendor':'./src/vendor.browser.ts',
			'main':      AOT ? './src/main.browser.aot.ts' :
				'./src/main.browser.ts'
		},
		resolve: {
			/*
			 * An array of extensions that should be used to resolve modules.
			 */
			extensions: ['*', '.ts', '.js', '.json'],
			// An array of directory names to be resolved to the current directory
			modules: [helpers.root('src'), helpers.root("node_modules"), 'node_modules'],

		},
		module: {
			//see https://github.com/angular/angular/issues/11580
			exprContextCritical: false,
		},
		node: {
			global: true,
			crypto: 'empty',
			process: true,
			module: 'empty',
			clearImmediate: false,
			setImmediate: false,
			fs: 'empty'
		}
	}
};
