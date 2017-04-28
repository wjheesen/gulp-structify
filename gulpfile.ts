import gulp = require("gulp");
import rename = require("gulp-rename")
import structify from 'gulp-structify/main'
import { Gulpclass, Task } from 'gulpclass'

@Gulpclass()
export class Gulpfile {
    @Task()
    structify() {
        return gulp.src("./examples/**/*.template.ts")
            .pipe(structify())
            // Remove ".template" from filename
            .pipe(rename(p => {  
                let base = p.basename;
                let length = base.length - ".template".length;
                p.basename = base.substr(0, length);
            })) 
            // Output to same folder to preserve imports
            .pipe(gulp.dest("./examples/"));
    }
}