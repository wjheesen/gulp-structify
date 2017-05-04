# gulp-structify
Generates WebGL-compatible structs and struct buffers from a template file.

[![NPM](https://nodei.co/npm/gulp-structify.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/gulp-structify/)

## Install
`npm install gulp-structify --save-dev`

## Create a template file: 
Suppose we want to create a `Vec2` struct backed by a `Float32Array`. We start with a minimal template file called `Vec2.template.ts`:

```TypeScript
import Template from "gulp-structify/template";

/**
 * A two-dimensional vector with (x,y) components.
 */
export class Vec2 extends Template<Float32Array> {
    /**
     * The X component of this Vec2.
     */
    x: number;
    /**
     * The Y component of this Vec2.
     */
    y: number;
}
```

Note: the template should not include a constructor or any static methods. 

## Add methods to the template
Now suppose we want to add a `dot` method to our `Vec2` struct. We do this by adding the method to our template: 

```TypeScript
export class Vec2 extends Template<Float32Array> {
    // ... 

    /**
     * Computes the dot product of this Vec2 with the other Vec2.
     */
    dot(other: Vec2): number {
        return this.x * other.x + this.y * other.y;
    }
}

```

Note: `gulp-structify` automatically generates the following methods:
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

## Create gulp task
```javascript
var gulp = require("gulp");
var rename = require("gulp-rename");
var structify = require("gulp-structify");

// Directory where template file is located
var directory = "./"; 

gulp.task("structify", function () {
    // Search for files ending in .template.ts
    return gulp.src(directory + "*.template.ts")
        // Generate struct file
        .pipe(structify())
        // Remove ".template" from filename
        .pipe(rename(function(p) {
            let base = p.basename;
            let length = base.length - ".template".length;
            p.basename = base.substr(0, length);
        })) 
        // Output to same directory to preserve imports
        .pipe(gulp.dest(directory));
});
```
## Run gulp task
`gulp structify`

## Examples
Template | Output | Usage
-------- | ------ | -----
[point.template.ts][1] | [point.ts][2] |
[vec2.template.ts][4] | [vec2.ts][5] | [vec2-usage.ts][6]
[color.template.ts][7] | [color.ts][8] | 

[1]: https://github.com/wjheesen/gulp-structify/blob/master/examples/point.template.ts "Point Template"
[2]: https://github.com/wjheesen/gulp-structify/blob/master/examples/point.ts "Point Output"
[4]: https://github.com/wjheesen/gulp-structify/blob/master/examples/vec2.template.ts "Vec2 Template"
[5]: https://github.com/wjheesen/gulp-structify/blob/master/examples/vec2.ts "Vec2 Output"
[6]: https://github.com/wjheesen/gulp-structify/blob/master/examples/vec2-usage.ts "Vec2 Usage"
[7]: https://github.com/wjheesen/gulp-structify/blob/master/examples/color.template.ts "Color Template"
[8]: https://github.com/wjheesen/gulp-structify/blob/master/examples/color.ts "Color Output"

