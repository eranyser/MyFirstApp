"use strict";
const helpers = require('./helpers');
const tsConfig = require('../tsconfig.json');

module.exports = function (metadata, plugins) {
	const TEST = (metadata.ENV === 'test');
	const AOT = (metadata.AOT === true);
	const isProd = (metadata.ENV  ==='production');

	const SassOptions = {
		sourceMap: true
	};

	const loaders = {
			"dtrace": { test: /dtrace-provider/, loader: 'empty-loader' },
			"typescript": {
				test: /\.ts$/,
				use: [
					{
						loader: '@angularclass/hmr-loader',
						options: {
							pretty: !isProd,
							prod: isProd
						}
					},
					{ // MAKE SURE TO CHAIN VANILLA JS CODE, I.E. TS COMPILATION OUTPUT.
						loader: 'ng-router-loader',
						options: {
							loader: 'async-import',
							genDir: 'compiled',
							aot: AOT
						}
					},
					{
						loader: 'awesome-typescript-loader',
						options: {
							compilerOptions: TEST ? Object.assign({}, tsConfig.compilerOptions, {
								"sourceMaps": false,
								"inlineSourceMap": true
							}) : tsConfig.compilerOptions,
							configFileName: 'tsconfig.webpack.json',
							transpileOnly: TEST,
							sourceMap: true,
							inlineSourceMap: TEST
						}
					},
					{ loader: 'angular2-template-loader' }
				],
				exclude: [/\.(spec|e2e)\.ts$/]
				// exclude: [/node_modules/]
			},
			"es6": {
				test: /\.js$/,
				use: [{ loader: 'babel-loader' }],
				exclude: [/node_modules/
					, /ribbon-tab-items\.data/
					, /pma\.initial\.state/]
			},
			"html": {
				test: /\.html$/,
				exclude: /index\.tmpl\.html/,
				use: [{
					loader: 'html-loader', options: {
						minimize: true,
						removeAttributeQuotes: false,
						caseSensitive: true,
						customAttrSurround: [[/#/, /(?:)/], [/\*/, /(?:)/], [/\[?\(?/, /(?:)/]],
						customAttrAssign: [/\)?\]?=/]
					}
				}],
			},
			"json": {
				test: /\.json$/, use: [{ loader: 'json-loader' }]
			},
			"css": {
				test: /\.css$/,
				exclude: [/\.component\.css/],
				use: TEST ? [{ loader: 'empty-loader' }]
					:
					[{ loader: 'style-loader' },
						{ loader: 'css-loader', options: { sourceMap: true } },
						{ loader: 'postcss-loader' }, //postcss options is given via LoaderOptionsPlugin
					],
			},
			"componentCss": {
				test: /component\.css$/,
				use: TEST ? [{ loader: 'empty-loader' }]
					:
					[{ loader: 'css-to-string-loader' }, { loader: 'css-loader', options: { sourceMap: true } },
						{ loader: 'postcss-loader' }, //postcss options is given via LoaderOptionsPlugin
					],
			},
			"woff": {
				test: /\.woff(\?v=\d+\.\d+\.\d+)?$/,
				use: [{
					loader: 'url-loader',
					options: { name: 'assets/fonts/[name].[ext]?[hash]', limit: 10000, mimetype: 'application/font-woff' }
				}]
			},
			"woff2": {
				test: /\.woff2(\?v=\d+\.\d+\.\d+)?$/,
				use: [{
					loader: 'url-loader',
					options: { name: 'assets/fonts/[name].[ext]?[hash]', limit: 10000, mimetype: 'application/font-woff' }
				}]
			},
			"ttf": {
				test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
				use: [{
					loader: 'url-loader',
					options: { name: 'assets/fonts/[name].[ext]?[hash]', limit: 10000, mimetype: 'application/octet-stream' }
				}]
			},
			"eot": {
				test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
				use: [{
					loader: "file-loader",
					options: { name: 'assets/fonts/[name].[ext]?[hash]' }
				}]
			},
			"svg": {
				test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
				exclude: [/\.icon\.svg/],
				use: [{
					loader: 'url-loader',
					options: { name: 'assets/fonts/[name].[ext]?[hash]', limit: 10000, mimetype: 'image/svg+xml' }
				}]
			},
			"svgIcon": {
				test: /\.icon\.svg(\?v=\d+\.\d+\.\d+)?$/,
				use: [{
					loader: 'url-loader',
					options: { name: 'assets/images/[name].[ext]?[hash]', limit: 10000, mimetype: 'image/svg+xml' }
				}]
			},
			"png": {
				test: /\.png(\?.*)?$/,
				use: [{
					loader: 'url-loader',
					options: { name: 'assets/images/[name].[ext]?[hash]', limit: 10000, mimetype: 'image/png' }
				}]
			},
			"jpg": {
				test: /\.(jpeg|jpg)(\?.*)?$/,
				use: [{
					loader: 'file-loader',
					options: { name: 'assets/images/[name].[ext]?[hash]', mimetype: 'image/jpeg' }
				}]
			},
			"gif": {
				test: /\.gif(\?.*)?$/,
				use: [{
					loader: 'url-loader',
					options: { name: 'assets/images/[name].[ext]?[hash]', limit: 10000, mimetype: 'image/gif' }
				}]
			},
			'sass': {
				test: /\.scss$/,
				exclude: [/\.component\.scss/],
				use: TEST ? [{ loader: 'empty-loader' }] :
					[{ loader: 'style-loader' }, { loader: 'css-loader', options: { sourceMap: true } },
						{ loader: 'postcss-loader' }, //postcss options is given via LoaderOptionsPlugin
						{ loader: 'resolve-url-loader' },
						{
							loader: 'sass-loader', options: Object.assign({}, SassOptions)
						}]
			},
			'component.sass': {
				test: /\.component\.scss/,
				use: TEST ? [{ loader: 'css-to-string-loader' }, { loader: 'empty-loader' }] :
					[{ loader: 'css-to-string-loader' }, { loader: 'css-loader', options: { sourceMap: true } },
						{ loader: 'postcss-loader' }, //postcss options is given via LoaderOptionsPlugin
						{ loader: 'resolve-url-loader' },
						{
							loader: 'sass-loader', options: Object.assign({}, SassOptions)
						}]
			}
		}
	;

	if (TEST && metadata.coverage) {
		loaders.coverage = {
			enforce: 'post',
			query: {
				esModules: true
			},
			test: /\.(js|ts)$/,
			loader: 'istanbul-instrumenter-loader',
			include: helpers.root('src'),
			exclude: [
				helpers.root('src/svg-spritemap.loader.js'),
				/\.(e2e|spec)\.ts$/,
				helpers.root('src/app/common/services/server-api.worker.helper.ts'),
				/node_modules/
			]
		}
	}
	if (metadata.ENV !== 'production') {
		/**
		 * Tslint loader support for *.ts files
		 *
		 * See: https://github.com/wbuchwalter/tslint-loader
		 */
		loaders.tslint = {
			enforce: 'pre',
			test: /\.ts$/,
			loader: 'tslint-loader',
			exclude: [/node_modules/, /web-ui-core[\/|\\]/] // (nadav) todo find how not to write the string web-ui-core here..
		};

		loaders.sourcemapPreloader = {
			enforce: 'pre',
			test: /\.js$/,
			loader: 'source-map-loader',
			exclude: [
				// these packages have problems with their sourcemaps
				helpers.root('src/svg-spritemap.loader.js'),
				helpers.root('node_modules/rxjs'),
				helpers.root('node_modules/ng2-dnd'),
				helpers.root('node_modules/@angular'),
				helpers.root('node_modules/@ngrx/core'),
				helpers.root('node_modules/bunyan'),
				helpers.root('node_modules/source-map-support'),
			]
		}
	}
	return loaders;
};
