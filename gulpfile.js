'use strict'

const gulp = require('gulp'),
  sourcemap = require('gulp-sourcemaps'),
  postcss = require('gulp-postcss'),
  autoprefixer = require('autoprefixer'),
  posthtml = require('gulp-posthtml'),
  webp = require('gulp-webp'),
  imagemin = require('gulp-imagemin'),
  sync = require('browser-sync').create(),
  reload = sync.reload,
  htmlmin = require('gulp-htmlmin'),
  plumber = require('gulp-plumber'),
  sass = require('gulp-sass'),
  del = require('del'),
  rename = require('gulp-rename');


//Styles
const styles = () => {
  return gulp.src('src/styles/index.scss')
    .pipe(plumber())
    .pipe(sourcemap.init())
    .pipe(sass())
    .pipe(postcss([autoprefixer()]))
    .pipe(sourcemap.write('.'))
    .pipe(gulp.dest('dist/styles'))
    .pipe(reload({stream: true}))
};
exports.styles = styles;



//Html
const html = () => {
  return gulp.src('src/*.html')
    .pipe(gulp.dest('dist'))
    .pipe(reload({stream: true}))
};
exports.html = html;



//Scripts
const scripts = () => {
  return gulp.src('src/js/**/*.js')
    .pipe(gulp.dest('dist/js'))
    .pipe(reload({stream: true}))
};
exports.scripts = scripts;



//Imagemin
const images = () => {
  return gulp.src('src/img/**/*.svg')
    .pipe(imagemin([
      imagemin.optipng({optimizationLevel: 3}),
      imagemin.mozjpeg({progressive: true}),
      imagemin.svgo()
      ]))
    .pipe(gulp.dest('src/img'))
};
exports.images = images;



//Webp
const convertWebp = () => {
  return gulp.src('src/img/**/*.{png, jpg}')
    .pipe(webp({quality: 50}))
    .pipe(gulp.dest('src/img'))
};
exports.convertWebp = convertWebp;



//Clean
const clean = () => {
  return del('dist')
};
exports.clean = clean;



//Copy
const copy = () => {
return gulp.src([
  'src/fonts/**/*.{woff,woff2}',
  'src/img/**',
  'src/scripts/**',
  'src/*.ico',
  'src/*.png'
  ],
  {base: 'src'}
  )
  .pipe(gulp.dest('dist'))
};
exports.copy = copy;



//Server
const server = () => {
  sync.init({
    server: 'dist',
    open: true,
    notify: false,
    cors: true,
    ui: false
  })

    gulp.watch('src/styles/**/*.scss', gulp.series(styles, refresh));
    gulp.watch('src/js/**/*.js', gulp.series(scripts, refresh));
    gulp.watch('src/*.html', gulp.series(html, refresh));
};
exports.server = server;


const refresh = done => {
  sync.reload();
  done();
};
exports.refresh = refresh;


const build = gulp.series(clean, copy, styles, html, scripts, server);
exports.build = build;

const start = gulp.series(build, server);
exports.start = start;
