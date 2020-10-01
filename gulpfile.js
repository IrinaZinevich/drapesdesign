var gulp = require('gulp'),
    jade = require('gulp-jade'),
    data = require('gulp-data'),
    sass = require('gulp-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    imagemin = require('gulp-imagemin'),
    concat = require('gulp-concat'),
    minify = require('gulp-minify'),
    browserSync = require('browser-sync').create(),
    fs = require('fs');

    sass.compiler = require('node-sass');

function style() {
    return gulp.src('./assets/styles/styles.scss')
        .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
        .pipe(autoprefixer(['last 15 versions', '> 1%'], { cascade: true }))
        .pipe(gulp.dest('./app/styles'))
        .pipe(browserSync.stream());
}

function styleLibs() {
    return gulp.src('assets/styles/libs/*.css')
        .pipe(gulp.dest('app/styles/libs'))
        .pipe(browserSync.stream());
}

function tpl() {
    return gulp.src('./templates/**/**/*.jade')
        .pipe(data( function(file) {
            return JSON.parse(
                fs.readFileSync('./data.json' , { encoding: 'utf8' })
            );
        }))
        .pipe(jade({
            pretty: true
        }))
        .pipe(gulp.dest('app')).pipe(browserSync.stream());
}

function images() {
    return gulp.src('assets/images/**/*.+(png|jpg|svg)')
        .pipe(imagemin())
        .pipe(gulp.dest('app/images'))
        .pipe(browserSync.stream());
}

function scripts() {
    return gulp.src('assets/js/*.js')
        // .pipe(concat('script.js')) // Собираем все JS, кроме тех которые находятся в ./assets/js/vendor/**
        .pipe(minify())
        .pipe(gulp.dest('app/js'))
        .pipe(browserSync.stream()); // даем команду на перезагрузку страницы
}

function scriptsLibs() {
    return gulp.src('assets/js/libs/**/*.js')
        .pipe(minify())
        .pipe(gulp.dest('app/js/libs'))
        .pipe(browserSync.stream()); // даем команду на перезагрузку страницы
}

function watch() {
    browserSync.init({
        server: {
            baseDir: './app',
        }
    });
    gulp.watch('./assets/styles/**/*.scss', style);
    gulp.watch('./assets/styles/libs/*.css', styleLibs);
    gulp.watch('./templates/**/*.jade', tpl);
    gulp.watch('./assets/js/*.js', scripts);
    gulp.watch('./assets/js/libs/*.js', scriptsLibs);
    gulp.watch('./assets/images/**/*.+(png|jpg|svg)', images);

}
exports.tpl = tpl;
exports.style = style;
exports.styleLibs = styleLibs;
exports.scripts = scripts;
exports.scriptsLibs = scriptsLibs;
exports.images = images;
exports.watch = watch;
