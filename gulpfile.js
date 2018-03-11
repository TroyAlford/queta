const gulp = require('gulp')
const concat = require('gulp-concat')
const replace = require('gulp-replace')

const PATH = {
  JS: './node_modules/glaemscribe/build/web/glaemscribe/js',
  FONT: './node_modules/glaemscribe/fonts/webs',
}

gulp.task('default', ['shim-js', 'copy-fonts'])

gulp.task('shim-js', () => (
  gulp.src([
    `${PATH.JS}/glaemscribe.js`,

    `${PATH.JS}/charsets/cirth_ds.cst.js`,
    `${PATH.JS}/charsets/sarati_eldamar.cst.js`,
    `${PATH.JS}/charsets/tengwar_ds_annatar.cst.js`,
    `${PATH.JS}/charsets/tengwar_ds_eldamar.cst.js`,
    `${PATH.JS}/charsets/tengwar_ds_elfica.cst.js`,
    `${PATH.JS}/charsets/tengwar_ds_parmaite.cst.js`,
    `${PATH.JS}/charsets/tengwar_ds_sindarin.cst.js`,
    `${PATH.JS}/charsets/tengwar_freemono.cst.js`,
    `${PATH.JS}/charsets/unicode_gothic.cst.js`,
    `${PATH.JS}/charsets/unicode_runes.cst.js`,

    `${PATH.JS}/modes/adunaic.glaem.js`,
    `${PATH.JS}/modes/blackspeech.glaem.js`,
    `${PATH.JS}/modes/mercian.glaem.js`,
    `${PATH.JS}/modes/quenya-sarati.glaem.js`,
    `${PATH.JS}/modes/quenya.glaem.js`,
    `${PATH.JS}/modes/raw-tengwar.glaem.js`,
    `${PATH.JS}/modes/rlyehian.glaem.js`,
    `${PATH.JS}/modes/sindarin-beleriand.glaem.js`,
    `${PATH.JS}/modes/sindarin-daeron.glaem.js`,
    `${PATH.JS}/modes/sindarin.glaem.js`,
    `${PATH.JS}/modes/telerin.glaem.js`,
    `${PATH.JS}/modes/valarin-sarati.glaem.js`,
    `${PATH.JS}/modes/westron.glaem.js`,
    `${PATH.JS}/modes/westsaxon.glaem.js`,

    `./vendor/glaemscribe.shim.js`,
  ]).pipe(concat('glaemscribe.js'))
    .pipe(gulp.dest('./vendor/build'))
))

gulp.task('copy-fonts', () => (
  gulp.src([
    `${PATH.FONT}/sarati-eldamar-rtlb-glaemscrafu.{eot,svg,ttf,woff}`,
    `${PATH.FONT}/tengwar-annatar-glaemscrafu-bold.{eot,svg,ttf,woff}`,
    `${PATH.FONT}/tengwar-annatar-glaemscrafu-italic.{eot,svg,ttf,woff}`,
    `${PATH.FONT}/tengwar-annatar-glaemscrafu.{eot,svg,ttf,woff}`,
    `${PATH.FONT}/tengwar-eldamar-glaemscrafu.{eot,svg,ttf,woff}`,
    `${PATH.FONT}/tengwar-elfica-glaemscrafu.{eot,svg,ttf,woff}`,
    `${PATH.FONT}/tengwar-parmaite-glaemscrafu.{eot,svg,ttf,woff}`,
    `${PATH.FONT}/tengwar-sindarin-glaemscrafu.{eot,svg,ttf,woff}`,
  ]).pipe(gulp.dest('./vendor/build/fonts'))
))

