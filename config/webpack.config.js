"use strict";

const _ = require('lodash');
const webpack = require('webpack');
const helpers = require('./helpers');
const webpackMerge = require('webpack-merge');
const commonConfig = require('./webpack.common.config');

module.exports = function webpackConfig (options = {}) {
	const ENV = options.env || process.env.NODE_ENV || 'development';
	const HMR = helpers.hasProcessFlag('hot');

	///baseMeta is our options schema and defaults, things that end up in configuration must start here,
	// most of it is derived out of environment variables with superseding runtime arguments then defaults
	const metaData = {
		silent: helpers.isSilentMode(),
		host: process.env.HOST || 'localhost',
		port: process.env.PORT || 8080,
		ENV: ENV,
		HMR: HMR,
		coverage: eval(helpers.getOption('coverage', options, true)),
		SERVER_IP: 'http://' + helpers.getOption('IMAGINET_APP_SERVER', options, 'localhost'),
		title: 'Carestream Vue PACS Web',
		baseUrl: helpers.getOption('CLIENT_BASE_URL', options, undefined) || '.',
		isDevServer: helpers.isWebpackDevServer(),
		CHROME_EXT_ID: helpers.getOption('CHROME_EXT_ID', options, 'olejbabgoknafhaoapecbnejjlkankfi'),
		APP_SERVER: helpers.getOption('IMAGINET_APP_SERVER', options, 'localhost'),
		SHOW_STORE_DEV: helpers.getOption('SHOW_STORE_DEV', options, false),
		USE_DIRECT_SERVER_URL: helpers.getOption('USE_DIRECT_SERVER_URL', options, false),
		LOG_LEVEL: helpers.getOption('LOG_LEVEL', options),
		LOG_SRC: helpers.getOption('LOG_SRC', options, (ENV === 'production')),
		//whether to get the images directly from the server to the imagebox or through a blob (previously chrome workaround)
		HTTP_IMAGES: helpers.getOption('HTTP_IMAGES', options, false),
	};
	if (metaData.baseUrl !== '.')
		metaData.baseUrl = '/' + metaData.baseUrl;

	if (!metaData.silent) { // please keep any console.logs only inside this block
		console.log('setting USE_DIRECT_SERVER_URL:', metaData.USE_DIRECT_SERVER_URL);
		console.log('Using BaseUrl of ', metaData.baseUrl);
		console.log('CHROME_EXT_ID = ' + metaData.CHROME_EXT_ID);
		console.log('Application API server is ' + metaData.APP_SERVER + ' LogLevel is ' + metaData.LOG_LEVEL + " LogSrc = " + metaData.LOG_SRC);
		console.log('Using SERVER_IP environment variable as: ' + metaData.SERVER_IP);
		if (ENV === 'test') {
			console.log('coverage is ' + ((metaData.coverage) ? 'enabled' : 'disabled!'));
		}
		if (metaData.SHOW_STORE_DEV) {
			console.warn('will show store logger - performance will be degraded!');
		}
		console.log('HTTP_IMAGES = ' + metaData.HTTP_IMAGES);
	}
	const webpackPlugins = require('./webpack.plugins.js')(metaData);
	const config = webpackMerge(commonConfig(options), {
		plugins: _.values(webpackPlugins),
		module: {
			rules: _.values(require('./webpack.loaders')(metaData, webpackPlugins))
		},
	});
	if (ENV === 'development') {
		config.devServer = {
			port: metaData.port,
			host: metaData.host,
			noInfo: false,
			quiet: false,
			stats: {modules: false, timings: true, assets: true, chunkModules: false, reasons: false},
			historyApiFallback: true,
			proxy: {
				'/portal/*': {
					target: metaData.SERVER_IP,
					secure: false,
					bypass: (req, res) => {
						console.log("Node did a proxy bypass to remote server.");
						return false;
					}
				}
			},
			watchOptions: {
				aggregateTimeout: 300,
				poll: 1000
			}
		};
	}

	if (ENV === 'test') {
		config.entry = './config/spec-bundle.js';
		config.plugins.push(new webpack.NormalModuleReplacementPlugin(/ribbon-tab-items\.data/, require.resolve('../src/app/viewer/ribbon/data/ribbon-no-tab-items.test-data.ts')))
	}
	if (ENV !== 'test') {
		config.output = {
			path: helpers.root('dist'),
			filename: '[name].[chunkhash].bundle.js',
			sourceMapFilename: '[name].[chunkhash].bundle.map',
			chunkFilename: '[id].[chunkhash].chunk.js',
		};
	}

	return config;
};
