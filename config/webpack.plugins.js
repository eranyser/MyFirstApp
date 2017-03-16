"use strict";
const webpack = require('webpack');
const helpers = require('./helpers');

/**
 * Webpack Plugins
 */
// const tsConfig = require('../tsconfig.json');
const NamedModulesPlugin = require('webpack/lib/NamedModulesPlugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const AddAssetHtmlPlugin = require('add-asset-html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const CommonsChunkPlugin = require('webpack/lib/optimize/CommonsChunkPlugin');
// const ExtractTextPlugin = require("extract-text-webpack-plugin");
const CheckerPlugin = require('awesome-typescript-loader').CheckerPlugin;
// const TsConfigPathsPlugin = require('awesome-typescript-loader').TsConfigPathsPlugin;
const ProvidePlugin = require('webpack/lib/ProvidePlugin');
const DefinePlugin = require('webpack/lib/DefinePlugin');
const NormalModuleReplacementPlugin = require('webpack/lib/NormalModuleReplacementPlugin');
const IgnorePlugin = require('webpack/lib/IgnorePlugin');
const DedupePlugin = require('webpack/lib/optimize/DedupePlugin');
const UglifyJsPlugin = require('webpack/lib/optimize/UglifyJsPlugin');
const HtmlElementsPlugin = require('./html-elements-plugin');
const dllBundles = require('./dll-bundles');
const SvgStore = require('webpack-svgstore-plugin');
const DllBundlesPlugin = require('webpack-dll-bundles-plugin').DllBundlesPlugin;
const OptimizeJsPlugin = require('optimize-js-plugin');
const webpackMerge = require('webpack-merge');
const ScriptExtHtmlWebpackPlugin = require('script-ext-html-webpack-plugin');
const path = require('path');
// const CompressionPlugin = require('compression-webpack-plugin');// does not work on windows currently
// const SplitByPathPlugin = require('webpack-split-by-path'); // not compatible with worker loader - disbaled for now

module.exports = function (metadata) {
	const plugins = {
		"fix": new webpack.ContextReplacementPlugin( 	//see https://github.com/angular/angular/issues/11580
			// The (\\|\/) piece accounts for path separators in *nix and Windows
			/angular(\\|\/)core(\\|\/)(esm(\\|\/)src|src)(\\|\/)linker/,
			helpers.root('src')  // location of your src
		),
		"fork": new CheckerPlugin(),
		"SvgStore": new SvgStore({
			svgoOptions: { // svgo options https://github.com/svg/svgo
				plugins: [
					{ removeStyleElement: true },
					{ collapseGroups: true },
					{ cleanupIDs: true },
					{ removeDimensions: true }
				]
			}
		}),
		// "Paths": new TsConfigPathsPlugin(tsConfig),
		// "provide": new webpack.ProvidePlugin({
		// 	$: "jquery",
		// 	jQuery: "jquery"
		// }),
		"html": new HtmlWebpackPlugin({ // https://github.com/ampedandwired/html-webpack-plugin
			minify: (metadata.ENV === 'production') ? { removeComments: true } : false, // https://github.com/kangax/html-minifier#options-quick-reference
			metadata: metadata,
			inject: 'head', // but we use defer so this is actually evaluated at body load end
			hash: true,
			chunksSortMode: 'dependency',
			template: 'src/index.tmpl.html',
			//     chunks:'viewer',  // when doing angular in webworkers we must make use of these to omit the webworker chunk
			filename: 'index.html'
		}),
		/*
		 * Plugin: HtmlHeadConfigPlugin
		 * Description: Generate html tags based on javascript maps.
		 *
		 * If a publicPath is set in the webpack output configuration, it will be automatically added to
		 * href attributes, you can disable that by adding a "=href": false property.
		 * You can also enable it to other attribute by settings "=attName": true.
		 *
		 * The configuration supplied is map between a location (key) and an element definition object (value)
		 * The location (key) is then exported to the template under then htmlElements property in webpack configuration.
		 *
		 * Example:
		 *  Adding this plugin configuration
		 *  new HtmlElementsPlugin({
		 *    headTags: { ... }
		 *  })
		 *
		 *  Means we can use it in the template like this:
		 *  <%= webpackConfig.htmlElements.headTags %>
		 *
		 * Dependencies: HtmlWebpackPlugin
		 */
		"headTags": new HtmlElementsPlugin({ headTags: require('./head-config.common') }),
		"define": new webpack.DefinePlugin({
			'ENV': JSON.stringify(metadata.ENV),
			'HMR': metadata.HMR,
			'process.env': {
				'CHROME_EXT_ID': JSON.stringify(metadata.CHROME_EXT_ID),
				'ENV': JSON.stringify(metadata.ENV),
				'PHANTOM': JSON.stringify(metadata.PHANTOM),
				'NODE_ENV': JSON.stringify(metadata.ENV),
				'SHOW_STORE_DEV': JSON.stringify(metadata.SHOW_STORE_DEV),
				'HMR': metadata.HMR,
				"HTTP_IMAGES": JSON.stringify(metadata.HTTP_IMAGES),

			},
			"USE_DIRECT_SERVER_URL": JSON.stringify(metadata.USE_DIRECT_SERVER_URL),
			'APP_SERVER': JSON.stringify(metadata.APP_SERVER),
			'LOG_LEVEL': JSON.stringify(metadata.LOG_LEVEL),
			'LOG_SRC': JSON.stringify(metadata.LOG_SRC),
			"HTTP_IMAGES": metadata.HTTP_IMAGES
		}),
		"commonOptions": new webpack.LoaderOptionsPlugin({
			options: {
				postcss: require('./postcss.config'),
				context: helpers.root(),
				output: { path: helpers.root('dist') },

				/**
				 * Static analysis linter for TypeScript advanced options configuration
				 * Description: An extensible linter for the TypeScript language.
				 *
				 * See: https://github.com/wbuchwalter/tslint-loader
				 */
				tslint: {
					emitErrors: true,
					formatter: 'stylish',
					typeCheck: false,
					tsConfigFile: 'tsconfig.json',
					failOnHint: false,
					resourcePath: 'src'
				},
				htmlLoader: {
					minimize: true,
					removeAttributeQuotes: false,
					caseSensitive: true,
					customAttrSurround: [
						[/#/, /(?:)/],
						[/\*/, /(?:)/],
						[/\[?\(?/, /(?:)/]
					],
					customAttrAssign: [/\)?\]?=/]
				}
			}
		}),
		ext: new ScriptExtHtmlWebpackPlugin({
			defaultAttribute: 'defer'
		})
	};
	if (metadata.ENV !== 'test') {
		plugins.copy = new CopyWebpackPlugin([
			{ from: 'src/assets', to: 'assets' },
		]);

		plugins.commonChunks0 = new CommonsChunkPlugin({
			name: 'polyfills',
			chunks: ['polyfills']
		});
		// This enables tree shaking of the vendor modules
		plugins.commonChunks1 = new CommonsChunkPlugin({
			name: 'vendor',
			chunks: ['main'],
			minChunks: module => /node_modules/.test(module.resource)
		});
		// Specify the correct order the scripts will be injected in
		plugins.commonChunks2 = new CommonsChunkPlugin({
			name: ['polyfills', 'vendor'].reverse()
		});


		// plugins.extractText = new ExtractTextPlugin({name:"assets/css/[name].css",disabled: metadata.ENV !== 'production'});
	}

	if (metadata.ENV === 'production') {
		// plugins.compress = new CompressionPlugin({ // does not work on windows currently
		// 	regExp: /\.css$|\.html$|\.js$|\.map$/,
		// 	threshold: 2 * 1024
		// });
		plugins.optimize = new OptimizeJsPlugin({
			sourceMap: true
		});
		plugins.clean = new CleanWebpackPlugin(['dist'], {
			root: helpers.root(),
			verbose: true,
			dry: false
		});

		plugins.uglify = new UglifyJsPlugin({
			// beautify: true, //debug
			// mangle: false, //debug
			// dead_code: false, //debug
			// 			unused: false, //debug
			// deadCode: false, //debug
			// compress: {
			//   screw_ie8: true,
			//   keep_fnames: true,
			//   drop_debugger: false,
			//   dead_code: false,
			//   unused: false
			// }, // debug
			// comments: true, //debug
			sourceMap: true,
			beautify: false, //prod
			mangle: { screw_ie8: true, keep_fnames: true }, //prod
			compress: { screw_ie8: true }, //prod
			comments: false //prod
		});
		plugins.replace = new NormalModuleReplacementPlugin(
			/angular2-hmr/,
			helpers.root('config/modules/angular2-hmr-prod.js')
		);
		// plugins.md5Hash = new WebpackMd5Hash(); https://github.com/AngularClass/angular2-webpack-starter/issues/1416
	} else {
		/*Plugin: NamedModulesPlugin (experimental)
		 * Description: Uses file names as module name.
		 *
		 * See: https://github.com/webpack/webpack/commit/a04ffb928365b19feb75087c63f13cadfc08e1eb

		 */
		plugins.names = new NamedModulesPlugin();
		// if (metadata.env !== 'test') {
		plugins.dll = new DllBundlesPlugin({
			bundles: dllBundles,
			dllDir: helpers.root('dll'),
			webpackConfig: webpackMerge(require('./webpack.common.config')({ env: metadata.ENV }), { devtool: 'sourcemap' })
		});
		/**
		 * Plugin: AddAssetHtmlPlugin
		 * Description: Adds the given JS or CSS file to the files
		 * Webpack knows about, and put it into the list of assets
		 * html-webpack-plugin injects into the generated html.
		 *
		 * See: https://github.com/SimenB/add-asset-html-webpack-plugin
		 */
		plugins.dllAssets = new AddAssetHtmlPlugin([
			{ filepath: helpers.root(`dll/${DllBundlesPlugin.resolveFile('polyfills')}`) },
			{ filepath: helpers.root(`dll/${DllBundlesPlugin.resolveFile('vendor')}`) }
		]);
		// }
	}
	return plugins;
};
