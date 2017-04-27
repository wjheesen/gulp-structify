import gulp = require("gulp");
import rename = require("gulp-rename")
import { Gulpclass, Task } from 'gulpclass'
import { structify } from './src/main';

@Gulpclass()
export class Gulpfile {
    @Task()
    structify() {
        return gulp.src("./examples/**/*.template.ts")
            .pipe(structify())
            .pipe(rename(p => { 
                // Remove ".template" from filename
                let base = p.basename;
                let length = base.length - ".template".length;
                p.basename = base.substr(0, length);
            })) 
            .pipe(gulp.dest("./examples/"));
    }
}