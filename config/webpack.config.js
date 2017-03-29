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
		title: 'Carestream Base Angular Web App',
		baseUrl: helpers.getOption('CLIENT_BASE_URL', options, undefined) || '.',
		isDevServer: helpers.isWebpackDevServer(),
		AOT: Boolean(helpers.getOption('AOT', options, false)),
	};
	if (metaData.baseUrl !== '.')
		metaData.baseUrl = '/' + metaData.baseUrl;

	if (!metaData.silent) { // please keep any console.logs only inside this block
		console.log('Using BaseUrl of ', metaData.baseUrl);
		if (ENV === 'test') {
			console.log('coverage is ' + ((metaData.coverage) ? 'enabled' : 'disabled!'));
		}
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
				//WRITE PROXY CONFIG HERE
			},
			watchOptions: {
				aggregateTimeout: 300,
				poll: 1000
			}
		};
	}

	if (ENV === 'test') {
		config.entry = './config/spec-bundle.js';
	}
	if (ENV !== 'test') {
		config.output = {
			path: helpers.root('dist'),
			filename: '[name].[hash].bundle.js',
			sourceMapFilename: '[name].[hash].bundle.map',
			chunkFilename: '[id].[hash].chunk.js',
		};
	}
	return config;
};
