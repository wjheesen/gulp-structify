import gulp = require("gulp");
import del = require("del");
import rename = require("gulp-rename");
import runSequence = require("run-sequence");
import ts = require("gulp-typescript");
import sourcemaps = require("gulp-sourcemaps");
import merge = require("merge-stream");
import structify = require("./src/main");

gulp.task("build:examples", function(){
    // Search for files ending in .template.ts
    return gulp.src("./examples/**/*.template.ts")
        // Generate struct file
        .pipe(structify())
        // Remove ".template" from filename
        .pipe(rename(p => {  
            let base = p.basename;
            let length = base.length - ".template".length;
            p.basename = base.substr(0, length);
        })) 
        // Output to same folder to preserve imports
        .pipe(gulp.dest("./examples/"));
})

gulp.task("build:lib", function(cb: gulp.TaskCallback){
    runSequence("clean:lib",["compile:src", "copy:packageFiles"], cb);
});

gulp.task("clean:lib", function(){
    return del(["./lib/**/*"]);
})

gulp.task("compile:src", function(){
    let tsProject = <any> ts.createProject("tsconfig.json");
    let tsResult = <any> gulp.src("./src/*.ts").pipe(sourcemaps.init()).pipe(tsProject());
    return merge(tsResult, tsResult.js)
        .pipe(sourcemaps.write())
        .pipe(gulp.dest("./lib"));
})

gulp.task("copy:packageFiles", function(){
    gulp.src(["./package.json", "./README.md", "./LICENSE"])
        .pipe(gulp.dest("./lib"));
})



