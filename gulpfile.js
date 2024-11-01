const {src, dest, watch, parallel, series} = require('gulp');

const scss = require('gulp-sass')(require('sass'));
const concat = require('gulp-concat');
const uglify = require('gulp-uglify-es').default;
const browserSync = require('browser-sync').create();
// const autoprefixer = require('gulp-autoprefixer').create();
const clean = require('gulp-clean');


function scripts(){
  return src([
    'node_modules/swiper/swiper-bundle.js',
    'app/js/main.js'

    // 'app/js/*.js', находит все файлы js 
    // '!app/js/main.min.js' и исключаем min.js
  ])
    // .pipe(autoprefixer({overrideBrowserslist: ['last 10 version']})) //что-то про работу новых свойств стилей в браузерах
    .pipe(concat('main.min.js')) // объединение и переименование 
    .pipe(uglify()) // минифицирование
    .pipe(dest('app/js')) // выкинуть в папку 
    .pipe(browserSync.stream()) // обновление страницы браузера
}

function styles(){
  return src('app/scss/style.scss')
    .pipe(concat('style.min.css'))
    .pipe(scss({outputStyle: 'compressed'})) // переформатирование в сss  и сжатие 
    .pipe(dest('app/css'))
    .pipe(browserSync.stream())
}

function watching(){
  watch(['app/scss/style.scss'], styles)
  watch(['app/js/main.js'], scripts)
  watch(['app/*.html']).on('change', browserSync.reload); 
}

function browsersync (){
  browserSync.init({
    server: {
        baseDir: "app"
    }
});
}

function cleanDist (){
  return src('dist')
    .pipe(clean())
}

function building (){
  return src([
    'app/css/style.min.css',
    'app/js/main.min.js',
    'app/**/*.html'
  ], {base: 'app'})
    .pipe(dest('dist'))
}

exports.styles = styles;
exports.scripts = scripts;
exports.watching = watching;
exports.browsersync = browsersync;
exports.build = series(cleanDist, building);

exports.default = parallel(styles, scripts, watching, browsersync )
