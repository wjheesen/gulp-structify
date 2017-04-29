var gulp = require("gulp");
var rename = require("gulp-rename");
var structify = require("gulp-structify");

gulp.task("structify", function () {
    // Search for files ending in .template.ts
    return gulp.src("./examples/**/*.template.ts")
        // Generate struct file
        .pipe(structify())
        // Remove ".template" from filename
        .pipe(rename(function(p) {
            let base = p.basename;
            let length = base.length - ".template".length;
            p.basename = base.substr(0, length);
        })) 
        // Output to same folder to preserve imports
        .pipe(gulp.dest("./examples/"));
});
