// some magic is happening here thanks to the svg-store-plugin
const __svg__ = {path: './assets/icon/**/*.svg', name: 'assets/icon/[hash].icons.svg'};
require('webpack-svgstore-plugin/src/helpers/svgxhr')(__svg__);
module.exports = __svg__;

