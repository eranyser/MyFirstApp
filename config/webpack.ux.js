const webpackMerge = require('webpack-merge'); // used to merge webpack configs
let devConfigFactory = require('./webpack.config.js');
module.exports = function (env) {
	let devConfig = devConfigFactory(env); // the settings that are common to prod and dev
	let devServerConf = Object.assign({}, devConfig.devServer, {port: 9000});
	return webpackMerge(devConfig, {
		devServer: devServerConf,
		entry: {
			'polyfills': './src/polyfills.browser.ts',
			'vendor': './src/vendor.browser.ts',
			'main': './src/ux.browser.ts'
		}
	});
};
