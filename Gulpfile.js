/*
 * Gulpfile.js
 *
 *  - `gulp` compiles a development build and start a local server
 *
 *      Optional arguments:
 *
 *      1. `production` minifies all *.js and *.css
 *      2. `livereload` enables livereload within browsers
 *
 *      An argument is passed on the command line, ex: `gulp --livereload`
 */

/*
 * Frontload all third party library requires
 *
 * 1.  gulp, needed to build gulp tasks
 * 2.  browserify, needed to compile JavaScript code that uses `require`
 * 3.  reactify, processes react's jsx syntax
 * 4.  source, I am not entirely sure yet
 * 5.  gulpif, used to conditional execute gulp chains
 * 6.  uglify, used in production builds to minify/uglify JavaScript
 * 7.  minifyCSS, minifies all CSS sheets
 * 8.  concat, merges a bunch of files together
 * 9.  streamify, not entirely sure yet
 * 10. connect, used for local development server
 * 11. argv, used for reading commandline optional flags
 */
var gulp = require("gulp"),
    browserify = require("browserify"),
    reactify = require("reactify"),
    source = require("vinyl-source-stream"),
    gulpif = require("gulp-if"),
    streamify = require("gulp-streamify"),
    uglify = require("gulp-uglify"),
    minifyCSS = require("gulp-minify-css"),
    concat = require("gulp-concat"),
    connect = require("gulp-connect"),
    argv = require("yargs").argv,
    livereload = require('gulp-livereload');

/*
 * Main workflow tasks
 *
 * - "default" is run via `gulp`, optional arguments are:
 *      1. --production, for a minified build
 *      2. --livereload to push live updates to your browser
 */
gulp.task("default", [ "run-server" ]);

/*
 * Secondary workflow tasks
 *   These are used as building blocks for the primary workflow tasks.
 */
gulp.task("watch-files", [ "copy-html" ], function () {
    gulp.watch("app/js/**/*.js", [ "recompile-js" ]);
    gulp.watch("app/css/**/*.css", [ "recompile-css" ]);
    gulp.watch("app/index.html", [ "recopy-html" ]);
    gulp.watch("app/assets/**/*", [ "recopy-assets" ]);
});

gulp.task("run-server", [ "watch-files" ], function () {
    if (argv.livereload) {
        livereload.listen();
    }

    return connect.server({ root: "build/", port: 8000 });
});

gulp.task("compile-css", [ "compile-js" ], compileCSS);
gulp.task("recompile-css", compileCSS);

gulp.task("copy-html", [ "copy-assets" ], copyHTML);
gulp.task("recopy-html", copyHTML);

gulp.task("copy-assets", [ "compile-css" ], copyAssets);
gulp.task("recopy-assets", copyAssets);

gulp.task("compile-js", [ "compile-external-js" ], compileJS);
gulp.task("recompile-js", compileJS);

gulp.task("compile-external-js", function () {
	return browserify({
		debug: true
	})
	.require("react")
	.require("react-dom")
	.require("flux")
	.require("object-assign")
	.require("events")
    .require("react-tap-event-plugin")
    .require("material-ui")
    .require("immutable")
    .require("react-addons-transition-group") //https://github.com/callemall/material-ui/issues/2818 felipethome is such a homie
    .bundle()
    .pipe(source("vendors.js"))
    .pipe(streamify(uglify()))
    .pipe(gulp.dest("build/js/"));
});

/*
 * Helper functions
 *   These help DRY up some of the (re)compilation logic.
 */
function compileCSS() {
    return gulp.src("app/css/**/*.css")
               .pipe(concat("bundled.css"))
               .pipe(gulpif(argv.production, streamify(minifyCSS())))
               .pipe(gulp.dest("build/css/"))
               .pipe(gulpif(argv.livereload, livereload()));
}

function copyHTML() {
    return gulp.src("app/index.html")
               .pipe(gulp.dest("build/"))
               .pipe(gulpif(argv.livereload, livereload()));
}

function copyAssets() {
    return gulp.src("app/assets/**/*")
               .pipe(gulp.dest("build/assets/"))
               .pipe(gulpif(argv.livereload, livereload()));
}

function compileJS() {
	return browserify({
		debug: true,
	})
	.require(require.resolve("./app/js/main.js"), { entry: true })
	.transform(reactify)
	.external("react")
	.external("react-dom")
	.external("flux")
	.external("object-assign")
	.external("events")
    .external("react-tap-event-plugin")
    .external("material-ui")
    .external("immutable")
    .external("react-addons-transition-group")
    .bundle()
    .pipe(source("main.js"))
    .pipe(gulpif(argv.production, streamify(uglify())))
    .pipe(gulp.dest("build/js/"))
    .pipe(gulpif(argv.livereload, livereload()));
}
