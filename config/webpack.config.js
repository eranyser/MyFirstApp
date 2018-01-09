"use strict";

const _ = require('lodash');
const webpack = require('webpack');
const helpers = require('./helpers');
const webpackMerge = require('webpack-merge');
const commonConfig = require('./webpack.common.config');
const webConfig = require('@algotec/web-config');

function appBaseWebpackConfig(metaData = {}) {
	if (metaData.baseUrl !== '.')
		metaData.baseUrl = '/' + metaData.baseUrl;

	if (!metaData.silent) { // please keep any console.logs only inside this block
		console.log('Using BaseUrl of ', metaData.baseUrl);
		if (metaData.ENV === 'test') {
			console.log('coverage is ' + ((metaData.coverage) ? 'enabled' : 'disabled!'));
		}
	}
	const webpackPlugins = require('./webpack.plugins.js')(metaData);
	const config = webpackMerge(commonConfig(metaData), {
		plugins: _.values(webpackPlugins),
		module: {
			rules: _.values(require('./webpack.loaders')(metaData, webpackPlugins))
		},
	});
	if (metaData.ENV === 'development') {
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

	if (metaData.ENV === 'test') {
		config.entry = './config/spec-bundle.js';
	}
	if (metaData.ENV !== 'test') {
		config.output = {
			path: helpers.root('dist'),
			filename: '[name].[hash].bundle.js',
			sourceMapFilename: '[name].[hash].bundle.map',
			chunkFilename: '[id].[hash].chunk.js',
		};
	}
	return config;
};

module.exports = function(runtimeOpts){
	runtimeOpts.title = 'Carestream Base Angular Web App';
	runtimeOpts.rootElementSelector = "alg-app";
	const metaData = webConfig.createMetadata(runtimeOpts);

	const webpackBuilder = webConfig.webpackBuilder(metaData);
	const config = webpackBuilder.extend(appBaseWebpackConfig).build();
	return config(metaData);
}
