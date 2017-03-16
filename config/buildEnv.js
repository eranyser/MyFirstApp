const args = require('yargs').argv;
const BUILD = args['webpack-build'] || process.env['webpack-build'];
const TEST = args['webpack-test'] || process.env['webpack-test'];
const SOURCEMAPS = args['sourcemaps'] || process.env['sourcemaps'];
const ENV = (TEST) ? 'test' : (BUILD) ? 'production' : 'development';

module.exports = {ENV, BUILD, TEST, SOURCEMAPS};