/* eslint-disable @typescript-eslint/no-var-requires */
const gulp = require('gulp')
const concat = require('gulp-concat')

const PATH = {
	FONTS: './node_modules/glaemscribe/fonts/build/webs',
	JS: './node_modules/glaemscribe/build/web/glaemscribe/js',
}

gulp.task('shim-js', () => (
	gulp.src([
		'./vendor/start.glaemscribe.shim',
		`${PATH.JS}/glaemscribe.js`,
		`${PATH.JS}/charsets/*.cst.js`,
		`${PATH.JS}/modes/*.glaem.js`,
		'./vendor/end.glaemscribe.shim',
	]).pipe(concat('glaemscribe.js'))
		.pipe(gulp.dest('./temp'))
))

gulp.task('copy-font-css', () => (
	gulp.src([
		`${PATH.FONTS}/*.css`,
		`${PATH.FONTS}/legacy/*.css`,
		'./vendor/fonts/*.font.css',
		'./vendor/styles.scss',
	]).pipe(concat('glaemscribe.scss'))
		.pipe(gulp.dest('./temp'))
))
gulp.task('copy-fonts', () => (
	gulp.src([
		`${PATH.FONTS}/*.{eot,svg,ttf,woff}`,
		`${PATH.FONTS}/legacy/*.{eot,svg,ttf,woff}`,
		'./vendor/fonts/**/*.{eot,svg,ttf,woff}',
	]).pipe(gulp.dest('./temp'))
))

gulp.task('default', gulp.parallel('shim-js', 'copy-fonts', 'copy-font-css'))
