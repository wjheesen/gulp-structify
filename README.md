# gulp-structify
Generates WebGL-compatible structs and struct buffers from a template file.

[![NPM](https://nodei.co/npm/gulp-structify.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/gulp-structify/)

## Install
`npm install gulp-structify --save-dev`

## Create a template file: 

`MyTemplate.template.ts`

```TypeScript
import Template from "gulp-structify/template";

export class MyTemplate extends Template<Float32Array> {
	property1: number;
	property2: number;
	method1(){ }
	method2(){ }
}
```
### Notes: 
- The type argument (in this case `Float32Array`) specifies the type of `TypedArray` that should be used to back the object when instantiated as a struct or a struct buffer.
- The object properties must all be of type `number`.
- The class should not include a constructor or any static methods. 
- The following methods are inherited from `Template`:
  - `set(other: this)`
  - `add(other: this)`
  - `subtract(other: this)`
  - `mulScalar(k: number)`
  - `divScalar(k: number)`
  - `equals(other: this)`
  - `equalsScalar(k: number)`
  - `epsilonEquals(other: this, e: number)`
  - `epsilonEqualsScalar(k: number, e: number)`
  - `toString()`


### Example templates: 
- [Point](https://github.com/wjheesen/gulp-structify/blob/master/examples/point.template.ts) 
- [Vec2](https://github.com/wjheesen/gulp-structify/blob/master/examples/vec2.template.ts)
- [Color](https://github.com/wjheesen/gulp-structify/blob/master/examples/color.template.ts)

## Run gulp task:

```javascript
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
```

`gulp structify`

### Example outputs: 
- [Point](https://github.com/wjheesen/gulp-structify/blob/master/examples/point.ts) 
- [Vec2](https://github.com/wjheesen/gulp-structify/blob/master/examples/vec2.ts)
- [Color](https://github.com/wjheesen/gulp-structify/blob/master/examples/color.ts)

### Example usage
- [Vec2](https://github.com/wjheesen/gulp-structify/blob/master/examples/vec2-usage.ts) 



