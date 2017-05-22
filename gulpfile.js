let gulp = require('gulp');
let browser = require('gulp-browser');
let sass = require('gulp-sass');

gulp.task('default', ['html', 'js', 'css']);

gulp.task('html', function(){
    return gulp.src('index.html')
        .pipe(gulp.dest('public'));
})

gulp.task('js', function(){
    return gulp.src('js/app.js')
        .pipe(browser.browserify())
        .pipe(gulp.dest('public'));
})

gulp.task('css', function(){
    return gulp.src('./scss/style.scss')
        .pipe(sass())
        .pipe(gulp.dest('public'));
})

gulp.task('watch', function () {
    gulp.watch('*.html', ['html']);
    gulp.watch('*.scss', ['css']);
    gulp.watch('*.js', ['js']);    
});