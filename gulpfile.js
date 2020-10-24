/* eslint-disable @typescript-eslint/no-var-requires */
const gulp = require('gulp')
const concat = require('gulp-concat')

const PATH = {
	FONTS: './node_modules/glaemscribe-fonts/fonts/build/webs',
	JS: './node_modules/glaemscribe-fonts/build/web/glaemscribe/js',
}

gulp.task('shim-js', () => (
	gulp.src([
		'./vendor/glaemscribe.shim.start.js',
		`${PATH.JS}/glaemscribe.js`,
		`${PATH.JS}/charsets/*.cst.js`,
		`${PATH.JS}/modes/*.glaem.js`,
		'./vendor/glaemscribe.shim.end.js',
	]).pipe(concat('glaemscribe.built.js'))
		.pipe(gulp.dest('./temp'))
))

gulp.task('copy-font-css', () => (
	gulp.src([
		`${PATH.FONTS}/*.css`,
		'./vendor/glaemscribe.classes.scss',
	]).pipe(concat('glaemscribe.built.scss'))
		.pipe(gulp.dest('./temp'))
))
gulp.task('copy-fonts', () => (
	gulp.src([
		`${PATH.FONTS}/*.{eot,svg,ttf,woff}`,
	]).pipe(gulp.dest('./temp'))
))

gulp.task('default', gulp.parallel('shim-js', 'copy-fonts', 'copy-font-css'))
