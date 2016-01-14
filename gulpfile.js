var gulp = require('gulp'),
    runSequence = require('run-sequence'),
    gulpif = require('gulp-if'),
    uglify = require('gulp-uglify'),
    // less = require('gulp-less'),
    csslint = require('gulp-csslint'),
    rev = require('gulp-rev'),
    minifyCss = require('gulp-minify-css'),
    changed = require('gulp-changed'),
    jshint = require('gulp-jshint'),
    stylish = require('jshint-stylish'),
    revCollector = require('gulp-rev-collector'),
    minifyHtml = require('gulp-minify-html'),
    autoprefixer = require('gulp-autoprefixer'),
    del = require('del');
   

// var cssSrc = ['main.less', 'layer-box.less', 'tag.less'],
var cssDest = 'dist/css',
    jsSrc = 'src/js/*.js',
    jsDest = 'dist/js',
    imgSrc = 'src/img/*',
    imgDest = 'dist/img',
    cssRevSrc = 'src/css/revCss',
    condition = true;
    // fontSrc = 'src/fonts/*',
    // fontDest = 'dist/font',
   

function changePath(basePath){
    var nowCssSrc = [];
    for (var i = 0; i < cssSrc.length; i++) {
        nowCssSrc.push(cssRevSrc + '/' + cssSrc[i]);
    }
    return nowCssSrc;
}

//Fonts & Images 根据MD5获取版本号
// gulp.task('revFont', function(){
//     return gulp.src(fontSrc)
//         .pipe(rev())
//         .pipe(gulp.dest(fontDest))
//         .pipe(rev.manifest())
//         .pipe(gulp.dest('src/rev/font'));
// });
gulp.task('revImg', function(){
    return gulp.src(imgSrc)
        .pipe(rev())
        .pipe(gulp.dest(imgDest))
        .pipe(rev.manifest())
        .pipe(gulp.dest('src/rev/img'));
});

//检测JS
// gulp.task('lintJs', function(){
//     return gulp.src(jsSrc)
//         //.pipe(jscs())   //检测JS风格
//         .pipe(jshint({
//             "undef": false,
//             "unused": false
//         }))
//         .pipe(jshint.reporter('default'))  //错误默认提示
//         .pipe(jshint.reporter(stylish))   //高亮提示
//         .pipe(jshint.reporter('fail'));
// });



//压缩JS/生成版本号
gulp.task('miniJs', function(){
    return gulp.src(jsSrc)
        .pipe(gulpif(
            condition, uglify()
        ))

        .pipe(rev())
        // .pipe(uglify('main.js'))
        .pipe(gulp.dest(jsDest))
        .pipe(rev.manifest())
        .pipe(gulp.dest('src/rev/js'));
});

//CSS里更新引入文件版本号
gulp.task('revCollectorCss', function () {
    return gulp.src(['src/rev/**/*.json', 'src/css/*.less'])
        .pipe(revCollector())
        .pipe(gulp.dest(cssRevSrc));
});

//检测CSS
gulp.task('lintCss', function(){
    return gulp.src(cssSrc)
        .pipe(csslint())
        .pipe(csslint.reporter())
        .pipe(csslint.failReporter());
});


//压缩/合并CSS/生成版本号
// gulp.task('miniCss', function(){
//     return gulp.src(changePath(cssRevSrc))
//         .pipe(less())
//         .pipe(gulpif(
//             condition, minifyCss({
//                 compatibility: 'ie7'
//             })
//         ))
//         .pipe(rev())
//         .pipe(gulpif(
//                 condition, changed(cssDest)
//         ))
//         .pipe(autoprefixer({
//             browsers: ['last 2 versions'],
//             cascade: false,
//             remove: false       
//         }))
//         .pipe(gulp.dest(cssDest))
//         .pipe(rev.manifest())
//         .pipe(gulp.dest('src/rev/css'));
// });

//压缩Html/更新引入文件版本
gulp.task('miniHtml', function () {
    return gulp.src(['src/rev/**/*.json', 'src/*.html'])
        .pipe(revCollector())
        .pipe(gulpif(
            condition, minifyHtml({
                empty: true,
                spare: true,
                quotes: true
            })
        ))
        .pipe(gulp.dest('dist'));
});

gulp.task('delRevCss', function(){
    del([cssRevSrc,cssRevSrc.replace('src/', 'dist/')]);    
})

//意外出错？清除缓存文件
gulp.task('clean', function(){
    del([cssRevSrc ,cssRevSrc.replace('src/', 'dist/')]);
})

//开发构建
gulp.task('dev', function (done) {
    condition = false;
    runSequence(
         ['revImg'],
         // ['lintJs'],
         ['revCollectorCss'],
         ['miniJs'],
         ['miniHtml', 'delRevCss'],
    done);
});

//正式构建
gulp.task('build', function (done) {
    runSequence(
         ['revImg'],
         // ['lintJs'],
         ['revCollectorCss'],
         ['miniJs'],
         ['miniHtml', 'delRevCss'],
    done);
});



gulp.task('default', ['build']);
