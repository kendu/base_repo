var gulp            = require('gulp'),
    gulpif          = require('gulp-if'),
    sourcemaps      = require('gulp-sourcemaps'),
    stripDebug      = require('gulp-strip-debug'),
    jshint          = require('gulp-jshint'),
    uglify          = require('gulp-uglify'),
    concat          = require('gulp-concat'),
    sass            = require('gulp-sass'),
    minifyCSS       = require('gulp-minify-css');
    livereload      = require('gulp-livereload');
    autoprefixer    = require('gulp-autoprefixer');
    imagemin        = require('gulp-imagemin');
    pngquant        = require('imagemin-pngquant');


var debug = (process.env.ENVIRONMENT == 'local');

process.stdout.write(
    "Running Gulp with debug="+debug+", env=" + process.env.ENVIRONMENT + "\n"
);


var cssLinks = [
    'bower_components/fontawesome/css/font-awesome.min.css',
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
    'bower_components/fontawesome/fonts/**',
    'bower_components/bootstrap-sass/assets/fonts/bootstrap/glyphicons-halflings-regular.*',
    'web/fonts/**'
];

/* Front tasks */
gulp.task('styles', function() {
  return gulp.src(cssLinks)
    .pipe(gulpif(debug, sourcemaps.init({loadMaps: true, debug: true})))
    .pipe(concat('front' + '.temp.scss'))
    .pipe(sass({
        errLogToConsole: true
    }))
    .pipe(concat('main.css'))
    .pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1'))
    .pipe(gulpif(debug, sourcemaps.write('./')))
    .pipe(gulp.dest('build/'))
    .pipe(livereload(
        port = '35729'
    ));
});

gulp.task('styles-build', function() {
  return gulp.src(cssLinks)
    .pipe(sass({
        errLogToConsole: true
    }))
    .pipe(concat('main.css'))
    .pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1'))
    .pipe(minifyCSS())
    .pipe(gulp.dest('build/'));
});

gulp.task('scripts', function() {
  return gulp.src(jsLinks)
    .pipe(gulpif(debug, sourcemaps.init({loadMaps: true, debug: true})))
    .pipe(concat('front' + '.temp.js'))
    .pipe(jshint())
    .pipe(jshint.reporter('default'))
    .pipe(concat('main.js'))
    .pipe(gulpif(debug, sourcemaps.write('./')))
    .pipe(gulp.dest('build/'))
    .pipe(livereload(
        port = '35729'
    ));
});

gulp.task('scripts-build', function() {
  return gulp.src(jsLinks)
    .pipe(jshint())
    .pipe(jshint.reporter('default'))
    .pipe(concat('main.js'))
    .pipe(uglify().on('error', function(err) {
        console.log(err.message);
        this.emit('end');
    }))
    .pipe(gulp.dest('build/'))
});


/* Fonts */
gulp.task('fonts', function() {
    return gulp.src(fontLinks)
    .pipe(gulp.dest('build/fonts/'));
});


/* Images */
gulp.task('images', function() {
    return gulp.src('web/images/**/*.{gif,jpg,png,svg}')
    .pipe(gulp.dest('build/images'));
})


gulp.task('images-build', function() {
    return gulp.src('web/images/**/*.{gif,jpg,png,svg}')
    .pipe(imagemin({
		progressive: true,
		svgoPlugins: [{removeViewBox: false}],
		use: [pngquant()]
	}))
    .pipe(gulp.dest('build/images'));
})


gulp.task('default', ['fonts', 'images', 'styles', 'scripts'], function() {
    livereload.listen();
    gulp.watch(['web/sass/*.scss', 'web/sass/components/*.scss'], ['styles']);
    gulp.watch(['web/js/*.js', 'web/js/components/*.js'], ['scripts']);
    gulp.watch(['web/images/**/*.{gif,jpg,png,svg}'], ['images']);

    /* Change document extension depending on which one you use */
    gulp.watch('/views/**/*.html').on( 'change', function( file ) {
        livereload.changed( file );
    });
});

gulp.task('build', ['fonts', 'images-build', 'styles-build', 'scripts-build' ]);
