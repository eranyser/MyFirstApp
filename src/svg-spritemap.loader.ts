// some magic is happening here thanks to the svg-store-plugin,
// the absolute paths do not make it to the final bundle at all,instead a sprite file is created and moved to assets
// where it is fetched from using this svgxhr helper utils
/* tslint:disable:variable-name */
(function mainAppSVG() {
	const __svg__ = {path: './offline_assets/icons/**/*.svg', name: 'assets/icon/[hash].icons.svg'};
	require('webpack-svgstore-plugin/src/helpers/svgxhr')(__svg__);
})();
(function uiPackAppSVG() {
	const __svg__ = {path: '../node_modules/@algotec/ui-elements-webkit/src/**/*.svg', name: 'assets/icon/[hash].ui-icons.svg'};
	require('webpack-svgstore-plugin/src/helpers/svgxhr')(__svg__);
})();
/* tslint:enable:variable-name */
