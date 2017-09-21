/**
 * Created by LXHFIGHT on 16/1/5.
 * use Gulp.js to manager the FrontEnd Project
 */
let gulp = require('gulp'),
    babel = require('gulp-babel'),
    cleanCSS = require('gulp-clean-css'),
    uglify = require('gulp-uglify'),
    concat = require('gulp-concat'),
    rename = require('gulp-rename'),
    imagemin = require('gulp-imagemin'),
    sass = require('gulp-sass-china'),
    notify = require('gulp-notify'),
    plumber = require('gulp-plumber'),
    connect = require('gulp-connect'),
    open = require('gulp-open');

let port = 8888;

let htmlSrc = [
        'app/index-dev.html',
        'app/views/**/*.html'
    ],                        // HTML文件位置

    indexSrc = 'app/index-dev.html',

    cssSrc = 'app/src/scss/**/*.scss',  // CSS源文件 SCSS文件
    cssDist = 'app/dist/css/',          // 编译后生成CSS文件存储位置

    imgSrc = 'app/src/img/**/*.*',      // 图片资源存放位置
    imgDist = 'app/dist/img/',         // 图片资源压缩后存放的位置

    jsSrc = [
        'app/src/js/app.js',
        'app/src/js/config.js',
        'app/src/js/ctrl/controller.js',
        'app/src/js/service/service.js',
        'app/src/js/value/value.js',

        'app/src/js/service/**/*.js',
        'app/src/js/directive/**/*.js',
        'app/src/js/flt/**/*.js',
        'app/src/js/value/**/*.js',
        'app/src/views/**/*.js',
    ],                                  // JavaScript脚本文件 源文件所在位置
    jsDist = 'app/dist/js/';            // Javascript合并压缩有存放的位置

/* 建立服务器并监控静态文件进行自动刷新 */
gulp.task('server', () => {
    // 热部署服务器将指向开发环境的首页 index-dev.html
    connect.server({
        root: 'app',
        index: 'index-dev.html',
        port,
        livereload: true
    });
    gulp.src(indexSrc).pipe(open({'uri': `http://localhost:${port}`}));
});

/* 监听HTML文件变化进行自动刷新 */
gulp.task('html', () => {
    gulp.src(htmlSrc)
        .pipe(connect.reload());
});

/* 将SCSS编译成CSS后进行合并压缩 最后输出到dist/css/app.min.css中  */
gulp.task('scss', () => {
    console.log('scss precessing...');

    // 面向开发环境的scss自动化处理
    gulp.src(cssSrc)
        .pipe(plumber())
        .pipe(sass())
        .pipe(concat("app.css"))
        .pipe(rename({  'suffix':'.dev'  }))
        .pipe(gulp.dest(cssDist))
        .pipe(connect.reload())
        .pipe(notify({message: 'CSS Files have been compressed'}));

    // 面向生产环境的scss自动化处理
    gulp.src(cssSrc)
        .pipe(plumber())
        .pipe(sass())
        .pipe(concat("app.css"))
        .pipe(rename({  'suffix':'.min'  }))
        .pipe(cleanCSS({ debug: true }, (details) => {
            console.log(`${details.name} is compressed from [ ${details.stats.originalSize}B ] to [ ${details.stats.minifiedSize}B ]'`);
        }))
        .pipe(gulp.dest(cssDist))
        .pipe(connect.reload())
        .pipe(notify({message: 'CSS Files have been compressed'}));
});

/* 将图片压缩之后输出达到dist/img目录下  */
gulp.task('img', () => {
    gulp.src(imgSrc)
        .pipe(imagemin())
        .pipe(gulp.dest(imgDist))
        .pipe(connect.reload())
        .pipe(notify({message: 'Image Files have been compressed'})) ;
});

/* 将Js文件合并压缩后输出到dist/js目录下 */
gulp.task('js', () => {
    console.log('Javascript precessing...');
    // 开发环境处理
    gulp.src(jsSrc)
        .pipe(plumber({}, true, function(err){
            console.log('ERROR OCCURED:');
            console.log(err);
        }))
        .pipe(babel({
            presets: ['es2015']
        }))
        .pipe(concat('main.js'))
        .pipe(rename({  'suffix': '.dev'  }))
        .pipe(connect.reload())
        .pipe(gulp.dest(jsDist));

    gulp.src(jsSrc)
        .pipe(plumber({}, true, (err) => {
            console.log('ERROR OCCURED:');
            console.log(err);
        }))
        .pipe(babel({
            presets: ['es2015']
        }))
        .pipe(concat('main.js'))
        .pipe(rename({  'suffix': '.min'  }))
        .pipe(uglify())
        .pipe(gulp.dest(jsDist))
        .pipe(connect.reload())
        .pipe(notify({message: 'js Files have been compressed'}));
});

gulp.task('watch', () => {
    gulp.watch(htmlSrc, ['html']);
    gulp.watch(cssSrc, ['scss']);
    gulp.watch(imgSrc, ['img']);
    gulp.watch(jsSrc,  ['js']);
});

// 根目录下执行 gulp 命令进行前端自动化处理
gulp.task('default', ['server', 'watch']);




