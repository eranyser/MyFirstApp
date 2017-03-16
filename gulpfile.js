const gulp = require('gulp')
const typescriptFormatter = require('gulp-typescript-formatter');
const gitmodified = require('gulp-gitmodified');
const path = require('path');
const gutil = require('gulp-util');
const debug = require('gulp-debug');

gulp.task('tsfmt', () => {
	return gulp.src('./src/**/*.ts')
		.on('error', gutil.log)
		.pipe(gitmodified('modified'))
		.pipe(debug('formatting typescript'))
		.pipe(typescriptFormatter({
			verbose: false,
			tslint: true, // use tslint.json file?
			tsfmt: true, // use tsfmt.json file? Overrides settings in tslint.json (at least indentSize)
			editorconfig: true,
		}))
		.pipe(gulp.dest('./src'));
});
