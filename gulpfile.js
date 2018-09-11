'use strict'
// gulpfile for gulp 4.0.0
// waldteufel@ukr.net

// gulp.series(['pug', 'sass'])   - послідовне виконання
// gulp.parallel(['pug', 'sass']) - асинхронне виконання

// VARIABLES
var gulp         = require('gulp'),                  //
    autoprefixer = require('gulp-autoprefixer'),     // додавання вендорних префіксів
    browserSync  = require('browser-sync').create(), // створення віртуального серверу  для live reload
    cache        = require('gulp-cache'),            // бібліотека кешування
    concat       = require('gulp-concat'),           // склеювання js-файлів
    cssconcat    = require('gulp-concat-css'),       // склеювання css-файлів
    cssnano      = require('gulp-cssnano'),          // мініфікація css-файлів
    csso         = require('gulp-csso'),             // мініфікація css-файлів
    del          = require('del'),                   // видалення файлів і тек
    gp           = require('gulp-load-plugins')(),   // щоб не оголошувати кожну змінну, застосовується для плагінів із префіксом gulp-
    imagemin     = require('gulp-imagemin'),         // робота із зображеннями
    notify       = require('gulp-notify'),           // обробка повідомлень про помилки
    pngquant     = require('imagemin-pngquant'),     // потрібен для роботи gulp-imagemin
    pug          = require('gulp-pug'),              // перетворення pug в html
    purge        = require('gulp-css-purge'),        // видалення дублюючого коду css
    rename       = require('gulp-rename'),           // перейменовування файлів
    sass         = require('gulp-sass'),             // перетворення sass/scss в css
    sourcemaps   = require('gulp-sourcemaps'),       //
    uglify       = require('gulp-uglify');           // мініфікація js-файлів


// TASKS
// перетворення pug в html
gulp.task('pug', function() {
  return gulp.src('app/*.pug')
    .pipe(pug({
      pretty: true
    }))
    .pipe(gulp.dest('app/'))
});

// створення віртуального серверу для live reload
gulp.task('browser-sync', function() {
  browserSync.init({
    server: {
      baseDir: 'app'
    },
    notify: false // відключення повідомлень browserSync
  });
});

// препроцесинг scss - style.scss
gulp.task('sass', function() {
  return gulp.src(['app/scss/*.+(scss|sass)'])
  .pipe(sass({outputStyle: 'compressed'}))
  .on('error', notify.onError({
    message: 'Error: <%= error.message %>',
    title: 'sass error'
  }))
  .pipe(autoprefixer({
    browsers : ['last 10 versions', '> 1%', 'ie 8', 'ie 7'],
    cascade  : true
  }))
  .pipe(csso({
    restructure : true, // злиття декларацій
    sourceMap   : false,
    debug       : false // виведення в консоль детальної інформації
  }))
  .pipe(gulp.dest('app/css'))
  .pipe(browserSync.reload({stream:true}))
});

// препроцесинг scss - BEM-blocks
gulp.task('sass-bem', function() {
  return gulp.src(['app/BEM-blocks/*/*.+(scss|sass)'])
  .pipe(sass({outputStyle: 'compressed'}))
  .on('error', notify.onError({
    message: 'Error: <%= error.message %>',
    title: 'sass error'
  }))
  .pipe(autoprefixer({
    browsers : ['last 10 versions', '> 1%', 'ie 8', 'ie 7'],
    cascade  : true
  }))
  .pipe(csso({
    restructure : true, // злиття декларацій
    sourceMap   : false,
    debug       : false // виведення в консоль детальної інформації
  }))
  .pipe(gulp.dest('app/BEM-blocks'))
  .pipe(browserSync.reload({stream:true}))
});

//мініфікація js - style.js
gulp.task('js', function() {
  return gulp.src(['app/js-expanded/*.js'])
    //.pipe(uglify())
    .pipe(gulp.dest('app/js'))
    .pipe(browserSync.reload({stream:true}));
});

//мініфікація js - BEM-blocks
gulp.task('js-bem', function() {
  return gulp.src(['app/BEM-blocks/*/*.js', '!app/BEM-blocks/minjs'])
    .pipe(uglify())
    .pipe(gulp.dest('app/BEM-blocks/minjs'));
});

// слідкування за змінами у збережених файлах, виклик препроцесингу та live reload
gulp.task('watch', gulp.parallel(
  gulp.series('sass', 'sass-bem', 'js', 'js-bem', 'pug', 'browser-sync'),
  function() {
    gulp.watch(['app/scss/*.+(scss|sass)'], gulp.series('sass'));
    gulp.watch(['app/BEM-blocks/*/*.+(scss|sass)'], gulp.series('sass-bem','pug'));

    gulp.watch(['app/js-expanded/*.js'], gulp.series('js','pug'));
    gulp.watch(['app/BEM-blocks/*/*.js', '!app/BEM-blocks/minjs'], gulp.series('js-bem','pug'));

    gulp.watch(['app/**/*.pug'], gulp.series('pug'));

    gulp.watch('app/*.html').on('change',  browserSync.reload);
  }
));

// чищення каталогу dist
gulp.task('clean', function(done) {
  return del('dist');
  done();
});

// обробка зображень
gulp.task('img', function() {
  return gulp.src('app/img/**/*')
    .pipe(cache(imagemin({
      interlaced: true,
      progressive: true,
      svgoPlugins: [{removeViewBox: false}],
      use: [pngquant()]
    })))
    .pipe(gulp.dest('dist/img'));
});

// перенесення файлів з каталогу app в dist
gulp.task('build', gulp.series(['clean', 'img'], function(done) {

  var buildCss = gulp.src('app/css/*.css')
  .pipe(gulp.dest('dist/css'))

  var buildFonts = gulp.src('app/fonts/**/*')
  .pipe(gulp.dest('dist/fonts'))

  var buildJs = gulp.src('app/js/**/*')
  .pipe(gulp.dest('dist/js'))

  var buildHtml = gulp.src('app/*.html')
  .pipe(gulp.dest('dist'));

  var buildVideo = gulp.src('app/video/*.*')
  .pipe(gulp.dest('dist/video'));

  var buildCssLibs = gulp.src('app/libs-css/*.*')
  .pipe(gulp.dest('dist/libs-css'));

  var buildJsLibs = gulp.src('app/libs/*.*')
  .pipe(gulp.dest('dist/libs'));

  done();
}));

// очистка кешу
gulp.task('clear', function () {
    return cache.clearAll();
})



//npm install --save-dev gulp-autoprefixer browser-sync gulp-cache gulp-concat gulp-concat-css gulp-cssnano gulp-csso del gulp-load-plugins gulp-imagemin gulp-notify imagemin-pngquant gulp-pug gulp-css-purge gulp-rename gulp-sass gulp-sourcemaps gulp-uglify

// How to install Gulp 4

// # Uninstall previous Gulp installation and related packages, if any
// $ npm rm gulp -g
// $ npm rm gulp-cli -g
// $ cd [your-project-dir/]
// $ npm rm gulp --save-dev
// $ npm rm gulp --save
// $ npm rm gulp --save-optional
// $ npm cache clean

// # Install the latest Gulp CLI tools globally
// $ npm install gulpjs/gulp-cli -g

// # Install Gulp 4 into your project from 4.0 GitHub branch as dev dependency
// $ npm install gulpjs/gulp#4.0 --save-dev

// # Check the versions installed. Make sure your versions are not lower than shown.
// $ gulp -v
// ---
// [10:48:35] CLI version 1.2.2
// [10:48:35] Local version 4.0.0-alpha.2