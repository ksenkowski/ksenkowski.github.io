// Define variables.
var autoprefixer = require('autoprefixer');
var browserSync  = require('browser-sync').create();
var cleancss     = require('gulp-clean-css');
var concat       = require('gulp-concat');
var del          = require('del');
var gulp         = require('gulp');
var gutil        = require('gulp-util');
var imagemin     = require('gulp-imagemin');
var notify       = require('gulp-notify');
var postcss      = require('gulp-postcss');
var rename       = require('gulp-rename');
var run          = require('gulp-run');
var runSequence  = require('run-sequence');
var sass         = require('gulp-ruby-sass');
var uglify       = require('gulp-uglify');

//Inculde paths file
var paths = require('./_assets/config/paths');

//Create main.css file
gulp.task('build:styles:main', function(){
	return sass(paths.sassFiles + '/main.scss', {
		style: 'compressed',
		trace: true.
		loadPath: [paths.sassFiles]
	}).pipe(postcss([autoprefixer({browsers: ['last 2 versions'] })]))
		.pipe(cleancss())
		.pipe(gulp.dest(paths.jekyllCssFiles))
		.pipe(gulp.dest(paths.siteCssFiles))
		.pipe(browserSync.stream())
		.on('error', gutil.log);
});

//Create Critical CSS to inline in head
gulp.task('build:styles:critical', function(){
	return sass(paths.sassFiles + '/critical.scss', {
		style: 'compressed',
		trace: true,
		loadPath: [paths.sassFiles]
	}).pipe(postcss([ autoprefixer({browsers: ['last 2 versions']})]))
		.pipe(cleancss())
		.pipe(gulp.dest('_includes/common/'))
	.on('error', gutil.log);
});

//Build all styles
gulp.task('build:styles', ['build:styles:main', 'build:styles:critical']);

//Delete CSS
gulp.task('clean:styles', function(callback) {
    del([paths.jekyllCssFiles + 'main.css', paths.siteCssFiles + 'main.css', '_includes/critical.css']);
    callback();
});

//Process JS
gulp.task('build:scripts', function(){
	return gulp.src([
		paths.jsFiles + '/lib' + paths.jsPattern,
		paths.jsFiles + '/*.js'
	]).pipe(concat('main.js'))
		.pipe(uglify())
		.pipe(gulp.dest(paths.jekyllJsFiles))
		.pipe(gul.dest(paths.siteJsFiles))
		.on('error', gutil.log);
});

//Delete processed JS.
gulp.task('clean:scripts', function(callback) {
    del([paths.jekyllJsFiles + 'main.js', paths.siteJsFiles + 'main.js']);
    callback();
});

//Copy Fonts
gulp.task('build:fonts', function(){
	
});


//Optimize images
gulp.task('build:images', function(){
	
});

//Run Jekyll Build
gulp.task('build:jekyll', function(){
	
});

//Build Fresh Site
gulp.task('build', function(){
	
});

//Default task = builds site
gulp.task('default', ['build']);

//Serves site locally and watches files
gulp.task('serve', ['build'], function(){
	
});
