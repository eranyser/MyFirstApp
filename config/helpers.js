/**
 * @author: @AngularClass
 */
var path = require('path');

const EVENT = process.env.npm_lifecycle_event || '';

// Helper functions
var ROOT = path.resolve(__dirname, '..');

function hasProcessFlag(flag) {
  return process.argv.join('').indexOf(flag) > -1;
}
function isSilentMode() {
	return hasProcessFlag('json') || hasProcessFlag('quiet');
}

function hasNpmFlag(flag) {
  return EVENT.includes(flag);
}

function isWebpackDevServer() {
  return process.argv[1] && !! (/webpack-dev-server/.exec(process.argv[1]));
}
const root = path.join.bind(path, ROOT);

function getOption(name, options, defaultVal) {
	return options[name] || process.env[name] || defaultVal;

}
exports.isSilentMode = isSilentMode;
exports.getOption = getOption;
exports.hasProcessFlag = hasProcessFlag;
exports.hasNpmFlag = hasNpmFlag;
exports.isWebpackDevServer = isWebpackDevServer;
exports.root = root;
