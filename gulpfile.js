"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var gulp = require("gulp");
var rename = require("gulp-rename");
var structify = require("gulp-structify");
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
