const gulp = require('gulp')
const concat = require('gulp-concat')

const PATH = {
  JS: './node_modules/glaemscribe/build/web/glaemscribe/js',
}

gulp.task('default', () => (
  gulp.src([
    `${PATH.JS}/glaemscribe.js`,
    `${PATH.JS}/charsets/*.cst.js`,
		`${PATH.JS}/modes/*.glaem.js`,
    `./vendor/glaemscribe.shim.js`,
  ]).pipe(concat('glaemscribe.built.js'))
    .pipe(gulp.dest('./dist'))
))
