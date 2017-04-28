// THIS IS AN AUTOGENERATED FILE. DO NOT EDIT THIS FILE DIRECTLY.
import Structure from "gulp-structify/struct";
import StructureBuffer from "gulp-structify/buf";

const ArgbRegex = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i;

function pad(str: string) {
    return (str.length == 1) ? '0' + str : str;
}

/**
 * Returns a random integer between min (inclusive) and max (inclusive)
 */
function randomInt(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * An 8-bit (r,g,b,a) color.
 */
interface Color {
    /**
     * The red component of this Color.
     */
    r: number;
    /**
     * The green component of this Color.
     */
    g: number;
    /**
     * The blue component of this Color.
     */
    b: number;
    /**
     * The alpha component of this Color.
     */
    a: number;
}
export { Color as _};
/**
 * Sets each component of this Color to that of the other Color.
 */
export function set(_this: Color, other: Color) {
    _this.r = other.r;
    _this.g = other.g;
    _this.b = other.b;
    _this.a = other.a;
}

/**
 * Sets each component of this Color.
 */
export function set$(_this: Color, r: number, g: number, b: number, a: number) {
    _this.r = r;
    _this.g = g;
    _this.b = b;
    _this.a = a;
}

/**
 * Adds the other Color to this Color componentwise.
 */
export function add(_this: Color, other: Color) {
    _this.r += other.r;
    _this.g += other.g;
    _this.b += other.b;
    _this.a += other.a;
}

/**
 * Adds the specified values to this Color componentwise.
 */
export function add$(_this: Color, r: number, g: number, b: number, a: number) {
    _this.r += r;
    _this.g += g;
    _this.b += b;
    _this.a += a;
}

/**
 * Subtracts the other Color from this Color componentwise.
 */
export function subtract(_this: Color, other: Color) {
    _this.r -= other.r;
    _this.g -= other.g;
    _this.b -= other.b;
    _this.a -= other.a;
}

/**
 * Subtracts the specified values from this Color componentwise.
 */
export function subtract$(_this: Color, r: number, g: number, b: number, a: number) {
    _this.r -= r;
    _this.g -= g;
    _this.b -= b;
    _this.a -= a;
}

/**
 * Multiplies each component of this Color by the specified scalar.
 */
export function mulScalar(_this: Color, k: number) {
    _this.r *= k;
    _this.g *= k;
    _this.b *= k;
    _this.a *= k;
}

/**
 * Divides each component of this Color by the specified scalar.
 */
export function divScalar(_this: Color, k: number) {
    _this.r /= k;
    _this.g /= k;
    _this.b /= k;
    _this.a /= k;
}

/**
 * Checks if each component of this Color is equal to that of the other Color.
 */
export function equals(_this: Color, other: Color) {
    return _this.r === other.r && _this.g === other.g && _this.b === other.b && _this.a === other.a;
}

/**
 * Checks if each component of this Color is equal to the specified scalar.
 */
export function equalsScalar(_this: Color, k: number) {
    return _this.r === k && _this.g === k && _this.b === k && _this.a === k;
}

/**
 * Checks if each component of this Color is approximately equal to that of the other Color.
 */
export function epsilonEquals(_this: Color, other: Color, e: number) {
    return Math.abs(_this.r - other.r) <= e && Math.abs(_this.g - other.g) <= e && Math.abs(_this.b - other.b) <= e && Math.abs(_this.a - other.a) <= e;
}

/**
 * Checks if each component of this Color is approximately equal to the specified scalar.
 */
export function epsilonEqualsScalar(_this: Color, k: number, e: number) {
    return Math.abs(_this.r - k) <= e && Math.abs(_this.g - k) <= e && Math.abs(_this.b - k) <= e && Math.abs(_this.a - k) <= e;
}

/**
 * Returns a string representation of this Color.
 */
export function toString(_this: Color) {
    return `{ r: ${_this.r}, g: ${_this.g}, b: ${_this.b}, a: ${_this.a} }`
}

/**
 * Checks if this Color is fully opaque. 
 */
export function isOpaque(_this: Color) {
    return _this.a === 0xff;
}

/**
 * Checks if this Color is fully transparent.
 */
export function isTransparent(_this: Color) {
    return _this.a === 0;
}

/**
 * Randomly sets the (r,g,b) components of this color.
 */
export function setRandom(_this: Color) {
    _this.r = randomInt(0, 0xff);
    _this.g = randomInt(0, 0xff);
    _this.b = randomInt(0, 0xff);
}

/**
 * Extracts the (r,g,b,a) components of the specified ARGB string into this Color.
 * @param argb hexadecimal string of the form #aarrggbb.
 */
export function setFromArgbString(_this: Color, argb: string) {
    let result = ArgbRegex.exec(argb);
    _this.a = parseInt(result[1], 16);
    _this.r = parseInt(result[2], 16);
    _this.g = parseInt(result[3], 16);
    _this.b = parseInt(result[4], 16);
}

/**
 * Creates an ARGB string from this Color's (r,g,b,a) components.
 * @returns string of the form #aarrggbb
 */
export function toArgbString(_this: Color) {
    let r = pad(_this.r.toString(16));
    let g = pad(_this.g.toString(16));
    let b = pad(_this.b.toString(16));
    let a = pad(_this.a.toString(16));
    return '#' + a + r + g + b;
}

/**
 * Extracts the (r,g,b,a) components of the specified RGBA int into this color.
 * @param rgba integer of the form 0xrrggbbaa.
 */
export function setFromRgbaInt(_this: Color, rgba: number) {
    _this.r = (rgba >> 24) & 0xff;
    _this.g = (rgba >> 16) & 0xff;
    _this.b = (rgba >> 8) & 0xff;
    _this.a = (rgba >> 0) & 0xff;
}

/**
 * Creates an RGBA int with this Color's (r,g,b,a) components.
 * @returns int of the form 0xrrggbbaa
 */
export function toRgbaInt(_this: Color) {
    let r = _this.r << 24;
    let g = _this.g << 16;
    let b = _this.b << 8;
    let a = _this.a << 0;
    return (r | g | b | a) >>> 0;
}

/**
 * Blends the source color into this color using (src.alpha, 1-src.alpha) blend mode.
 */
export function blend(_this: Color, src: Color) {
    let alpha = src.a + 1, invAlpha = 256 - src.a;
    _this.r = (alpha * src.r + invAlpha * _this.r) >> 8;
    _this.g = (alpha * src.g + invAlpha * _this.g) >> 8;
    _this.b = (alpha * src.b + invAlpha * _this.b) >> 8;
}

/**
 * An 8-bit (r,g,b,a) color.
 */
export class Obj {
    static create(other: Color) {
        let Color = new Obj();
        Color.set(other);
        return Color;
    }

    static create$(r: number, g: number, b: number, a: number) {
        let Color = new Obj();
        Color.set$(r, g, b, a);
        return Color;
    }

    static random() {
        let Color = new Obj();
        Color.setRandom();
        return Color;
    }

    static fromArgbString(argb: string) {
        let Color = new Obj();
        Color.setFromArgbString(argb);
        return Color;
    }

    static fromRgbaInt(rgba: number) {
        let Color = new Obj();
        Color.setFromRgbaInt(rgba);
        return Color;
    }

    /**
     * The red component of this Color.
     */
    r: number;
    /**
     * The green component of this Color.
     */
    g: number;
    /**
     * The blue component of this Color.
     */
    b: number;
    /**
     * The alpha component of this Color.
     */
    a: number;

    /**
     * Sets each component of this Color to that of the other Color.
     */
    set(other: Color) {
        return set(this, other);
    }

    /**
     * Sets each component of this Color.
     */
    set$(r: number, g: number, b: number, a: number) {
        return set$(this, r, g, b, a);
    }

    /**
     * Adds the other Color to this Color componentwise.
     */
    add(other: Color) {
        return add(this, other);
    }

    /**
     * Adds the specified values to this Color componentwise.
     */
    add$(r: number, g: number, b: number, a: number) {
        return add$(this, r, g, b, a);
    }

    /**
     * Subtracts the other Color from this Color componentwise.
     */
    subtract(other: Color) {
        return subtract(this, other);
    }

    /**
     * Subtracts the specified values from this Color componentwise.
     */
    subtract$(r: number, g: number, b: number, a: number) {
        return subtract$(this, r, g, b, a);
    }

    /**
     * Multiplies each component of this Color by the specified scalar.
     */
    mulScalar(k: number) {
        return mulScalar(this, k);
    }

    /**
     * Divides each component of this Color by the specified scalar.
     */
    divScalar(k: number) {
        return divScalar(this, k);
    }

    /**
     * Checks if each component of this Color is equal to that of the other Color.
     */
    equals(other: Color) {
        return equals(this, other);
    }

    /**
     * Checks if each component of this Color is equal to the specified scalar.
     */
    equalsScalar(k: number) {
        return equalsScalar(this, k);
    }

    /**
     * Checks if each component of this Color is approximately equal to that of the other Color.
     */
    epsilonEquals(other: Color, e: number) {
        return epsilonEquals(this, other, e);
    }

    /**
     * Checks if each component of this Color is approximately equal to the specified scalar.
     */
    epsilonEqualsScalar(k: number, e: number) {
        return epsilonEqualsScalar(this, k, e);
    }

    /**
     * Returns a string representation of this Color.
     */
    toString() {
        return toString(this);
    }

    /**
     * Checks if this Color is fully opaque. 
     */
    isOpaque() {
        return isOpaque(this);
    }

    /**
     * Checks if this Color is fully transparent.
     */
    isTransparent() {
        return isTransparent(this);
    }

    /**
     * Randomly sets the (r,g,b) components of this color.
     */
    setRandom() {
        return setRandom(this);
    }

    /**
     * Extracts the (r,g,b,a) components of the specified ARGB string into this Color.
     * @param argb hexadecimal string of the form #aarrggbb.
     */
    setFromArgbString(argb: string) {
        return setFromArgbString(this, argb);
    }

    /**
     * Creates an ARGB string from this Color's (r,g,b,a) components.
     * @returns string of the form #aarrggbb
     */
    toArgbString() {
        return toArgbString(this);
    }

    /**
     * Extracts the (r,g,b,a) components of the specified RGBA int into this color.
     * @param rgba integer of the form 0xrrggbbaa.
     */
    setFromRgbaInt(rgba: number) {
        return setFromRgbaInt(this, rgba);
    }

    /**
     * Creates an RGBA int with this Color's (r,g,b,a) components.
     * @returns int of the form 0xrrggbbaa
     */
    toRgbaInt() {
        return toRgbaInt(this);
    }

    /**
     * Blends the source color into this color using (src.alpha, 1-src.alpha) blend mode.
     */
    blend(src: Color) {
        return blend(this, src);
    }
}

/**
 * A Color backed by a Uint8Array.
 */
export class Struct extends Structure<Uint8Array> {
    static create(other: Color) {
        let Color = new Struct();
        Color.set(other);
        return Color;
    }

    static create$(r: number, g: number, b: number, a: number) {
        let Color = new Struct();
        Color.set$(r, g, b, a);
        return Color;
    }

    static random() {
        let Color = new Struct();
        Color.setRandom();
        return Color;
    }

    static fromArgbString(argb: string) {
        let Color = new Struct();
        Color.setFromArgbString(argb);
        return Color;
    }

    static fromRgbaInt(rgba: number) {
        let Color = new Struct();
        Color.setFromRgbaInt(rgba);
        return Color;
    }

    /**
     * Creates a Color struct.
     */
    constructor() {
        super(new Uint8Array(4));
    }

    /**
     * The red component of this Color.
     */
    get r() {
        return this.data[0];
    }

    /**
     * The red component of this Color.
     */
    set r(value: number) {
        this.data[0] = value;
    }

    /**
     * The green component of this Color.
     */
    get g() {
        return this.data[1];
    }

    /**
     * The green component of this Color.
     */
    set g(value: number) {
        this.data[1] = value;
    }

    /**
     * The blue component of this Color.
     */
    get b() {
        return this.data[2];
    }

    /**
     * The blue component of this Color.
     */
    set b(value: number) {
        this.data[2] = value;
    }

    /**
     * The alpha component of this Color.
     */
    get a() {
        return this.data[3];
    }

    /**
     * The alpha component of this Color.
     */
    set a(value: number) {
        this.data[3] = value;
    }

    /**
     * Sets each component of this Color to that of the other Color.
     */
    set(other: Color) {
        return set(this, other);
    }

    /**
     * Sets each component of this Color.
     */
    set$(r: number, g: number, b: number, a: number) {
        return set$(this, r, g, b, a);
    }

    /**
     * Adds the other Color to this Color componentwise.
     */
    add(other: Color) {
        return add(this, other);
    }

    /**
     * Adds the specified values to this Color componentwise.
     */
    add$(r: number, g: number, b: number, a: number) {
        return add$(this, r, g, b, a);
    }

    /**
     * Subtracts the other Color from this Color componentwise.
     */
    subtract(other: Color) {
        return subtract(this, other);
    }

    /**
     * Subtracts the specified values from this Color componentwise.
     */
    subtract$(r: number, g: number, b: number, a: number) {
        return subtract$(this, r, g, b, a);
    }

    /**
     * Multiplies each component of this Color by the specified scalar.
     */
    mulScalar(k: number) {
        return mulScalar(this, k);
    }

    /**
     * Divides each component of this Color by the specified scalar.
     */
    divScalar(k: number) {
        return divScalar(this, k);
    }

    /**
     * Checks if each component of this Color is equal to that of the other Color.
     */
    equals(other: Color) {
        return equals(this, other);
    }

    /**
     * Checks if each component of this Color is equal to the specified scalar.
     */
    equalsScalar(k: number) {
        return equalsScalar(this, k);
    }

    /**
     * Checks if each component of this Color is approximately equal to that of the other Color.
     */
    epsilonEquals(other: Color, e: number) {
        return epsilonEquals(this, other, e);
    }

    /**
     * Checks if each component of this Color is approximately equal to the specified scalar.
     */
    epsilonEqualsScalar(k: number, e: number) {
        return epsilonEqualsScalar(this, k, e);
    }

    /**
     * Returns a string representation of this Color.
     */
    toString() {
        return toString(this);
    }

    /**
     * Checks if this Color is fully opaque. 
     */
    isOpaque() {
        return isOpaque(this);
    }

    /**
     * Checks if this Color is fully transparent.
     */
    isTransparent() {
        return isTransparent(this);
    }

    /**
     * Randomly sets the (r,g,b) components of this color.
     */
    setRandom() {
        return setRandom(this);
    }

    /**
     * Extracts the (r,g,b,a) components of the specified ARGB string into this Color.
     * @param argb hexadecimal string of the form #aarrggbb.
     */
    setFromArgbString(argb: string) {
        return setFromArgbString(this, argb);
    }

    /**
     * Creates an ARGB string from this Color's (r,g,b,a) components.
     * @returns string of the form #aarrggbb
     */
    toArgbString() {
        return toArgbString(this);
    }

    /**
     * Extracts the (r,g,b,a) components of the specified RGBA int into this color.
     * @param rgba integer of the form 0xrrggbbaa.
     */
    setFromRgbaInt(rgba: number) {
        return setFromRgbaInt(this, rgba);
    }

    /**
     * Creates an RGBA int with this Color's (r,g,b,a) components.
     * @returns int of the form 0xrrggbbaa
     */
    toRgbaInt() {
        return toRgbaInt(this);
    }

    /**
     * Blends the source color into this color using (src.alpha, 1-src.alpha) blend mode.
     */
    blend(src: Color) {
        return blend(this, src);
    }
}

/**
 * A Color buffer backed by a Uint8Array.
 */
export class Buf extends StructureBuffer<Uint8Array> {
    /**
     * Creates an empty Color buffer with the specified Color capacity.
     */
    static create(capacity: number) {
        return new Buf(new Uint8Array(capacity * 4));
    }

    /**
     * The red component of the current Color.
     */
    get r() {
        return this.data[this.dataPosition + 0];
    }

    /**
     * The red component of the current Color.
     */
    set r(value: number) {
        this.data[this.dataPosition + 0] = value;
    }

    /**
     * The green component of the current Color.
     */
    get g() {
        return this.data[this.dataPosition + 1];
    }

    /**
     * The green component of the current Color.
     */
    set g(value: number) {
        this.data[this.dataPosition + 1] = value;
    }

    /**
     * The blue component of the current Color.
     */
    get b() {
        return this.data[this.dataPosition + 2];
    }

    /**
     * The blue component of the current Color.
     */
    set b(value: number) {
        this.data[this.dataPosition + 2] = value;
    }

    /**
     * The alpha component of the current Color.
     */
    get a() {
        return this.data[this.dataPosition + 3];
    }

    /**
     * The alpha component of the current Color.
     */
    set a(value: number) {
        this.data[this.dataPosition + 3] = value;
    }

    /**
     * Gets the number of components in a Color, namely 4.
     */
    structLength() {
        return 4;
    }

    /**
     * Sets each component of the Color at the specified position.
     */
    set$(position: number, r: number, g: number, b: number, a: number) {
        let dataPos = position * this.structLength();
        this.data[dataPos++] = r;
        this.data[dataPos++] = g;
        this.data[dataPos++] = b;
        this.data[dataPos++] = a;
    }

    /**
     * Sets each component of the current Color, then moves to the next position of this buffer.
     */
    put$(r: number, g: number, b: number, a: number) {
        this.data[this.dataPosition++] = r;
        this.data[this.dataPosition++] = g;
        this.data[this.dataPosition++] = b;
        this.data[this.dataPosition++] = a;
    }

    /**
     * Sets each component of the current Color to that of the other Color.
     */
    $set(other: Color) {
        return set(this, other);
    }

    /**
     * Sets each component of the current Color.
     */
    $set$(r: number, g: number, b: number, a: number) {
        return set$(this, r, g, b, a);
    }

    /**
     * Adds the other Color to the current Color componentwise.
     */
    $add(other: Color) {
        return add(this, other);
    }

    /**
     * Adds the specified values to the current Color componentwise.
     */
    $add$(r: number, g: number, b: number, a: number) {
        return add$(this, r, g, b, a);
    }

    /**
     * Subtracts the other Color from the current Color componentwise.
     */
    $subtract(other: Color) {
        return subtract(this, other);
    }

    /**
     * Subtracts the specified values from the current Color componentwise.
     */
    $subtract$(r: number, g: number, b: number, a: number) {
        return subtract$(this, r, g, b, a);
    }

    /**
     * Multiplies each component of the current Color by the specified scalar.
     */
    $mulScalar(k: number) {
        return mulScalar(this, k);
    }

    /**
     * Divides each component of the current Color by the specified scalar.
     */
    $divScalar(k: number) {
        return divScalar(this, k);
    }

    /**
     * Checks if each component of the current Color is equal to that of the other Color.
     */
    $equals(other: Color) {
        return equals(this, other);
    }

    /**
     * Checks if each component of the current Color is equal to the specified scalar.
     */
    $equalsScalar(k: number) {
        return equalsScalar(this, k);
    }

    /**
     * Checks if each component of the current Color is approximately equal to that of the other Color.
     */
    $epsilonEquals(other: Color, e: number) {
        return epsilonEquals(this, other, e);
    }

    /**
     * Checks if each component of the current Color is approximately equal to the specified scalar.
     */
    $epsilonEqualsScalar(k: number, e: number) {
        return epsilonEqualsScalar(this, k, e);
    }

    /**
     * Returns a string representation of the current Color.
     */
    $toString() {
        return toString(this);
    }

    /**
     * Checks if the current Color is fully opaque. 
     */
    $isOpaque() {
        return isOpaque(this);
    }

    /**
     * Checks if the current Color is fully transparent.
     */
    $isTransparent() {
        return isTransparent(this);
    }

    /**
     * Randomly sets the (r,g,b) components of this color.
     */
    $setRandom() {
        return setRandom(this);
    }

    /**
     * Extracts the (r,g,b,a) components of the specified ARGB string into the current Color.
     * @param argb hexadecimal string of the form #aarrggbb.
     */
    $setFromArgbString(argb: string) {
        return setFromArgbString(this, argb);
    }

    /**
     * Creates an ARGB string from the current Color's (r,g,b,a) components.
     * @returns string of the form #aarrggbb
     */
    $toArgbString() {
        return toArgbString(this);
    }

    /**
     * Extracts the (r,g,b,a) components of the specified RGBA int into this color.
     * @param rgba integer of the form 0xrrggbbaa.
     */
    $setFromRgbaInt(rgba: number) {
        return setFromRgbaInt(this, rgba);
    }

    /**
     * Creates an RGBA int with the current Color's (r,g,b,a) components.
     * @returns int of the form 0xrrggbbaa
     */
    $toRgbaInt() {
        return toRgbaInt(this);
    }

    /**
     * Blends the source color into this color using (src.alpha, 1-src.alpha) blend mode.
     */
    $blend(src: Color) {
        return blend(this, src);
    }
}
