var gulp = require('gulp');
    imagemin = require('gulp-imagemin');
    pngquant = require('imagemin-pngquant');
   





gulp.task('imagemin', function() {
     // gulp.src('images/*/*')
      gulp.src('images/*')
        .pipe(imagemin({
            progressive: true,
            svgoPlugins: [{
                removeViewBox: false
            }],
            use: [pngquant()]
        }))
        .pipe(gulp.dest('images/'));
});


gulp.task('default',['imagemin']);
