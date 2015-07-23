var gulp = require('gulp');
var ngAnnotate = require('gulp-ng-annotate');
var clean = require('gulp-clean');
var useref = require('gulp-useref');
var filter = require('gulp-filter');
var uglify = require('gulp-uglify');
var minifyCss = require('gulp-minify-css');
var rev = require('gulp-rev');
var revReplace = require('gulp-rev-replace');
var addSrc = require('gulp-add-src');
var debug = require('gulp-debug');
var ngTemplate = require('gulp-ng-template');
var htmlmin = require('gulp-htmlmin');
var htmlReplace = require('gulp-html-replace');

// clean the dist folder
// must return a stream for dependent tasks to wait for it to finish
// https://github.com/gulpjs/gulp/blob/master/docs/API.md#async-task-support
gulp.task('clean', function () {
    return gulp.src(['dist'], {read: false})
        .pipe(clean());
});

// main task to process the blocks of scripts and styles in index.html
gulp.task('main', ['clean'], function() {
    var userefAssets = useref.assets();

    // stream filters, call restore() to bing back the filtered out files
    var jsFilter = filter('**/*.js');
    var cssFilter = filter('**/*.css');
    var appjsFilter = filter('js/app.js');
    var revFilter = filter(['js/*', 'css/*', 'img/*']);
    var templatesFilter = filter(['tmpl/*', 'partials/*']);
    var indexFilter = filter('index.html');

    var sources = [
        'app/*.*',
        '!app/index.html',
        'app/img/**/*',
        'app/js/ie9.js',
        'app/tmpl/**/*',
        'app/partials/**/*'
    ];

    return gulp.src('app/index.html', { base: 'app' })
        .pipe(userefAssets) // concat the blocks of scripts and styles from index.html and put concatenated files to stream
        .pipe(appjsFilter)
        .pipe(ngAnnotate()) // annotate angular injections before uglifying sources
        .pipe(appjsFilter.restore())
        .pipe(jsFilter)
        .pipe(uglify())
        .pipe(jsFilter.restore())
        .pipe(cssFilter)
        .pipe(minifyCss())
        .pipe(cssFilter.restore())
        .pipe(userefAssets.restore()) // bring back the index.html
        .pipe(useref()) // replace script and style blocks in index.html with concatenated ones
        .pipe(addSrc(sources, { base: 'app' })) // add other files to the stream
        .pipe(templatesFilter)
        .pipe(htmlmin({
            collapseWhitespace: true,
            removeComments: true
        }))
        // load templates by $templateCache
        .pipe(ngTemplate({
            moduleName: 'app',
            filePath: 'js/templates.js'
        }))
        //.pipe(debug({minimal: false}))
        .pipe(uglify()) // uglify templates.js
        .pipe(templatesFilter.restore())
        .pipe(indexFilter)
        .pipe(htmlReplace({templates: 'js/templates.js'}))
        .pipe(htmlmin({
            collapseWhitespace: true,
            removeComments: true
        }))
        .pipe(indexFilter.restore())
        .pipe(revFilter)
        .pipe(rev()) // rev js, css and images
        .pipe(revFilter.restore())
        .pipe(revReplace()) // replace revved files references
        .pipe(gulp.dest('dist'));
});

gulp.task('default', [
    'clean',
    'main'
]);