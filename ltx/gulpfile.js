var gulp = require('gulp');
var coffee = require('gulp-coffee');
var coffeelint = require('gulp-coffeelint');
var express = require('express');
var path =require('path');
var httpProxy = require('http-proxy');
var mongoose= require('mongoose')
var http=require('http')
var _=require('underscore')
var request=require('request')
var fs=require('fs')
var watchify = require('watchify');
var gutil = require('gulp-util');
var httpProxy = require('http-proxy');  //http-proxy
var proxy = httpProxy.createProxyServer({})
var uglify = require('gulp-uglify');
var buffer = require('vinyl-buffer');
var useref = require('gulp-useref');
var csso = require('gulp-csso');
var compression = require('compression')
var bodyParser     =         require("body-parser");
var rev = require('gulp-rev');
var revReplace = require('gulp-rev-replace');
// 引入组件
var filter = require('gulp-filter');
var less = require('gulp-less'),            // less
    minifycss = require('gulp-minify-css'), // CSS压缩

    concat = require('gulp-concat'),        // 合并文件
    rename = require('gulp-rename'),        // 重命名
    clean = require('gulp-clean');          //清空文件夹


    var browserify = require("browserify");
    var babelify = require("babelify");
    var sourceStream = require("vinyl-source-stream");

    gulp.task('browserify', function(){
      return browserify('app/listImgs.js')
             .transform(babelify)
             .bundle()
             .pipe(sourceStream('bundle.js'))
             .pipe(gulp.dest('build'));
    });
    //add custom browserify options here
    var b = watchify(browserify(_.extend(watchify.args, {
      cache: {}, // required for watchify
      packageCache: {}, // required for watchify
      entries: ['app/listImgs.js']
    })));

    // add transformations here
    // i.e. b.transform(coffeeify);

    gulp.task('browserify', bundle);
    b.on('update', bundle); // on any dep update, runs the bundler
    b.on('log', console.log); // output build logs to terminal

    function bundle() {
      return b

      .transform(babelify)
      .bundle()
        // log errors if they happen
        .on('error', gutil.log.bind(gutil, 'Browserify Error'))
        .pipe(sourceStream('bundle.js'))
        // optional, remove if you don't need to buffer file contents
        // .pipe(buffer())
        // .pipe(uglify())
        .pipe(gulp.dest('build'));
    }













var app = express();


var source = {

  js: {
    app: [
      'src/**/*.coffee'
    ],

  },
  css :{
      lib:['node_modules/bootstrap/less/mixins/*.less'],
      business:['css/*.less']
  }





};



var build = {
    js:{
      lib:[
        'node_modules/jquery/dist/jquery.min.js',
        'node_modules/bootstrap/dist/js/bootstrap.min.js',
        'node_modules/underscore/underscore.js'
      ]
    }

}
var  build ='build';

gulp.task('validate_coffee', function () {
  gulp.src(source.js.app)
    .pipe(coffeelint())
    .pipe(coffeelint.reporter());
});

gulp.task('compile_coffee', ['validate_coffee'], function() {
  gulp.src(source.js.app)
    .pipe(coffee({bare: true}).on('error', console.log))
    .pipe(gulp.dest(build));
});

// less解析
gulp.task('build-less', function(){
  gulp.src(source.css.business)
    .pipe(less())
    .pipe(gulp.dest('./build'))
});

gulp.task('clean', function() {
  return gulp.src(['build/*.*'], {read: false})
    .pipe(clean({force: true}));
});




gulp.task('watch', function () {
    gulp.watch(source.js.app, ['compile_coffee']);
    gulp.watch(source.css.business, ['build-less']);
    gulp.watch("app/*.html", ['index']);

    // gulp.watch("app/**/*.js", ['browserify']);
});


gulp.task('server', function () {
  app.use(compression());
  app.use(express.static(path.join(__dirname, './')));
   app.get("/api/*",require('./proxy').proxy);
   app.use(bodyParser.urlencoded({ extended: false }));
   app.post("/api/*",require('./proxyPost').proxy);

   app.listen(8088);
console.log('Listening on port 8088');




});
gulp.task('default',['compile_coffee','build-less','watch','browserify','server'], function() {
  // place code for your default task here
});







gulp.task('deploy-js',function(){
  return browserify('app/listImgs.js')
    .transform(babelify)
    .bundle()
    .pipe(sourceStream('bundle.js')) // gives streaming vinyl file object
       .pipe(buffer()) // <----- convert from streaming to buffered vinyl file object
    .pipe(uglify()) // now gulp-uglify works
    .pipe(gulp.dest('./build'))  // write rev'd assets to build dir
});




gulp.task('index',["deploy-js"],function() {
  var jsFilter = filter("build/bundle.js",{restore: true});
   var cssFilter = filter('build/business.css',{restore: true});
  var userefAssets = useref.assets();
  return gulp.src('./app/*.html')
    .pipe(userefAssets)  // 解析html中build:{type}块，将里面引用到的文件合并传过来
    // .pipe(cssFilter)
    .pipe(jsFilter)
    .pipe(jsFilter.restore)
    .pipe(cssFilter)
    // .pipe(csso())               // 压缩Css
    .pipe(cssFilter.restore)
    .pipe(rev())                // 重命名文件
    .pipe(userefAssets.restore())
    .pipe(useref())
    .pipe(revReplace())         // 重写文件名到html
    .pipe(gulp.dest('./'));
});
