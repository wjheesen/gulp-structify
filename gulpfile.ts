import gulp = require("gulp");
import rename = require("gulp-rename")
import { Gulpclass, Task } from 'gulpclass'
import * as structify from './src/main';

@Gulpclass()
export class Gulpfile {
    @Task()
    structify() {
        return gulp.src("./examples/**/*.template.ts")
            .pipe(structify.run())
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