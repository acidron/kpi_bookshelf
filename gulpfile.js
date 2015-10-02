var gulp = require('gulp')
	//server = require('gulp-server-livereload'),
	//sass = require("gulp-sass"),
	//concat = require("gulp-concat")
	//autoprefixer = require('gulp-autoprefixer')
	;

var browserSync = require('browser-sync').create();

gulp.task("watch", ["htmlwatch"], function() {
     browserSync.init({
        open: false,
        notify: false,
        reload: true,
        proxy: 'localhost/kpi_test/public'
    });
});

gulp.task("htmlwatch", function() {
    gulp.watch(["public/*.html", "public/**/*.js"], function() {
        browserSync.reload();
    });
});

gulp.task('default', [ "watch"]);