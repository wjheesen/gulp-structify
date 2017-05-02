"use strict";
exports.__esModule = true;
var gulp = require("gulp");
var del = require("del");
var rename = require("gulp-rename");
var runSequence = require("run-sequence");
var ts = require("gulp-typescript");
var sourcemaps = require("gulp-sourcemaps");
var merge = require("merge-stream");
var structify = require("./src/main");
gulp.task("build:examples", function () {
    // Search for files ending in .template.ts
    return gulp.src("./examples/**/*.template.ts")
        .pipe(structify())
        .pipe(rename(function (p) {
        var base = p.basename;
        var length = base.length - ".template".length;
        p.basename = base.substr(0, length);
    }))
        .pipe(gulp.dest("./examples/"));
});
gulp.task("build:lib", function (cb) {
    runSequence("clean:lib", ["compile:src", "copy:packageFiles"], cb);
});
gulp.task("clean:lib", function () {
    return del(["./lib/**/*"]);
});
gulp.task("compile:src", function () {
    var tsProject = ts.createProject("tsconfig.json");
    var tsResult = gulp.src("./src/*.ts").pipe(sourcemaps.init()).pipe(tsProject());
    return merge(tsResult, tsResult.js)
        .pipe(sourcemaps.write())
        .pipe(gulp.dest("./lib"));
});
gulp.task("copy:packageFiles", function () {
    gulp.src(["./package.json", "./README.md", "./LICENSE"])
        .pipe(gulp.dest("./lib"));
});
