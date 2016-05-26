var gulp            = require('gulp'),
    gulpif          = require('gulp-if'),
    sourcemaps      = require('gulp-sourcemaps'),
    stripDebug      = require('gulp-strip-debug'),
    jshint          = require('gulp-jshint'),
    uglify          = require('gulp-uglify'),
    concat          = require('gulp-concat'),
    sass            = require('gulp-sass'),
    cleanCSS        = require('gulp-clean-css'),
    livereload      = require('gulp-livereload'),
    autoprefixer    = require('gulp-autoprefixer'),
    imagemin        = require('gulp-imagemin'),
    build           = process.argv[2] === 'build';

var cssLinks = [
    'web/sass/main.scss'
];

var jsLinks = [
    'bower_components/jquery/dist/jquery.js',
    'bower_components/bootstrap-sass/assets/javascripts/bootstrap.js',
    'bower_components/fastclick/lib/fastclick.js',
    'web/js/components/*.js',
    'web/js/main.js'
];

var fontLinks = [
    'bower_components/bootstrap-sass/assets/fonts/bootstrap/glyphicons-halflings-regular.*',
    'web/fonts/**'
];

/* Front tasks */
gulp.task('styles', function() {
  return gulp.src(cssLinks)
    .pipe(sourcemaps.init({loadMaps: true, debug: true}))
    .pipe(concat('front' + '.temp.scss'))
    .pipe(sass({
        errLogToConsole: true
    }))
    .pipe(concat('main.css'))
    .pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1'))
    .pipe(gulpif(build, cleanCSS()))
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('build/'))
    .pipe(livereload(
        port = '35729'
    ));
});

gulp.task('scripts', function() {
  return gulp.src(jsLinks)
    .pipe(sourcemaps.init({loadMaps: true, debug: true}))
    .pipe(concat('front' + '.temp.js'))
    .pipe(jshint())
    .pipe(jshint.reporter('default'))
    .pipe(concat('main.js'))
    .pipe(sourcemaps.write('./'))
    .pipe(gulpif(build, uglify().on('error', function(err) {
        console.log(err.message);
        this.emit('end');
    })))
    .pipe(gulp.dest('build/'))
    .pipe(livereload(
        port = '35729'
    ));
});

/* Fonts */
gulp.task('fonts', function() {
    return gulp.src(fontLinks)
    .pipe(gulp.dest('build/fonts/'));
});


/* Images */
gulp.task('images', function() {
    return gulp.src('web/images/**/*')
    .pipe(gulpif(build, imagemin()))
    .pipe(gulp.dest('build/images'));
})


gulp.task('default', ['fonts', 'images', 'styles', 'scripts'], function() {
    livereload.listen();
    gulp.watch(['web/sass/**/*.scss' ], ['styles']);
    gulp.watch(['web/js/*.js', 'web/js/components/*.js'], ['scripts']);
    gulp.watch(['web/images/**/*.{gif,jpg,png,svg}'], ['images']);

    /* Change document extension depending on which one you use */
    gulp.watch('/views/**/*.html').on( 'change', function( file ) {
        livereload.changed( file );
    });
});

gulp.task('build', ['fonts', 'images', 'styles', 'scripts' ]);
