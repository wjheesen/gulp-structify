// THIS IS AN AUTOGENERATED FILE. DO NOT EDIT THIS FILE DIRECTLY.
import {Struct} from "gulp-structify/struct";
import {StructBuffer} from "gulp-structify/buffer";
import {applyMixins} from "gulp-structify/mixin";

/**
 * Point with x and y coordinates.
 */
export class Point {
    static midpoint(p1: Point, p2: Point) {
        let point = new Point();
        point.setMidpoint(p1, p2);
        return point;
    }

    static create(other: PointLike) {
        let point = new Point();
        point.set(other);
        return point;
    }

    /**
     * The X coordinate of this point.
     */
    x: number;
    /**
     * The Y coordinate of this point.
     */
    y: number;

    /**
     * Point with x and y coordinates.
     */
    constructor(x = 0, y = 0) {
        this.x = x;
        this.y = y;
    }

    /**
     * Sets this point to the midpoint of p1 and p2.
     */
    setMidpoint(p1: Point, p2: Point) {
        this.x = 0.5 * (p1.x + p2.x);
        this.y = 0.5 * (p1.y + p2.y);
    }

    /**
     * Computes the distance between this point and the other point.
     * @param other defaults to origin.
     */
    distance(other?: Point) {
        return Math.sqrt(this.distance2(other));
    }

    /**
     * Computes the distance squared from this point to the other point.
     * @param other defaults to origin.
     */
    distance2(other?: Point) {
        let dx = other ? other.x - this.x : this.x;
        let dy = other ? other.y - this.y : this.y;
        return dx * dx + dy * dy;
    }

    /**
     * Sets each component of this Point to that of the other Point.
     */
    set(other: PointLike) {
        this.x = other.x;
        this.y = other.y;
    }

    /**
     * Sets each component of this Point.
     */
    set$(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    /**
     * Sets each component of this Point to the specified scalar.
     */
    setScalar(k: number) {
        this.x = k;
        this.y = k;
    }

    /**
     * Adds the other Point to this Point componentwise.
     */
    add(other: PointLike) {
        this.x += other.x;
        this.y += other.y;
    }

    /**
     * Adds the specified values to this Point componentwise.
     */
    add$(x: number, y: number) {
        this.x += x;
        this.y += y;
    }

    /**
     * Subtracts the other Point from this Point componentwise.
     */
    subtract(other: PointLike) {
        this.x -= other.x;
        this.y -= other.y;
    }

    /**
     * Subtracts the specified values from this Point componentwise.
     */
    subtract$(x: number, y: number) {
        this.x -= x;
        this.y -= y;
    }

    /**
     * Multiplies each component of this Point by the specified scalar.
     */
    mulScalar(k: number) {
        this.x *= k;
        this.y *= k;
    }

    /**
     * Divides each component of this Point by the specified scalar.
     */
    divScalar(k: number) {
        this.x /= k;
        this.y /= k;
    }

    /**
     * Checks if each component of this Point is exactly equal to that of the other Point.
     */
    equals(other: PointLike) {
        return this.x === other.x && this.y === other.y;
    }

    /**
     * Checks if each component of this Point is exactly equal to the specified scalar.
     */
    equalsScalar(k: number) {
        return this.x === k && this.y === k;
    }

    /**
     * Checks if each component of this Point is approximately equal to that of the other Point.
     */
    epsilonEquals(other: PointLike, e: number) {
        return Math.abs(this.x - other.x) <= e && Math.abs(this.y - other.y) <= e;
    }

    /**
     * Checks if each component of this Point is approximately equal to the specified scalar.
     */
    epsilonEqualsScalar(k: number, e: number) {
        return Math.abs(this.x - k) <= e && Math.abs(this.y - k) <= e;
    }

    /**
     * Returns a string representation of this Point.
     */
    toString() {
        return `{ x: ${this.x}, y: ${this.y} }`
    }
}

/**
 * Point with x and y coordinates.
 */
export interface PointLike {
    /**
     * The X coordinate of this point.
     */
    x: number;
    /**
     * The Y coordinate of this point.
     */
    y: number;
}

/**
 * A Point backed by a Float32Array.
 */
export class PointStruct extends Struct<Float32Array> {
    static midpoint(p1: Point, p2: Point) {
        let point = new PointStruct();
        point.setMidpoint(p1, p2);
        return point;
    }

    static create(other: PointLike) {
        let point = new PointStruct();
        point.set(other);
        return point;
    }

    static create$(x: number, y: number) {
        let point = new PointStruct();
        point.set$(x, y);
        return point;
    }

    /**
     * Sets this point to the midpoint of p1 and p2.
     */
    setMidpoint: (p1: Point, p2: Point) => void;
    /**
     * Computes the distance between this point and the other point.
     * @param other defaults to origin.
     */
    distance: (other: Point) => number;
    /**
     * Computes the distance squared from this point to the other point.
     * @param other defaults to origin.
     */
    distance2: (other: Point) => number;
    /**
     * Sets each component of this Point to that of the other Point.
     */
    set: (other: PointLike) => void;
    /**
     * Sets each component of this Point.
     */
    set$: (x: number, y: number) => void;
    /**
     * Sets each component of this Point to the specified scalar.
     */
    setScalar: (k: number) => void;
    /**
     * Adds the other Point to this Point componentwise.
     */
    add: (other: PointLike) => void;
    /**
     * Adds the specified values to this Point componentwise.
     */
    add$: (x: number, y: number) => void;
    /**
     * Subtracts the other Point from this Point componentwise.
     */
    subtract: (other: PointLike) => void;
    /**
     * Subtracts the specified values from this Point componentwise.
     */
    subtract$: (x: number, y: number) => void;
    /**
     * Multiplies each component of this Point by the specified scalar.
     */
    mulScalar: (k: number) => void;
    /**
     * Divides each component of this Point by the specified scalar.
     */
    divScalar: (k: number) => void;
    /**
     * Checks if each component of this Point is exactly equal to that of the other Point.
     */
    equals: (other: PointLike) => boolean;
    /**
     * Checks if each component of this Point is exactly equal to the specified scalar.
     */
    equalsScalar: (k: number) => boolean;
    /**
     * Checks if each component of this Point is approximately equal to that of the other Point.
     */
    epsilonEquals: (other: PointLike, e: number) => boolean;
    /**
     * Checks if each component of this Point is approximately equal to the specified scalar.
     */
    epsilonEqualsScalar: (k: number, e: number) => boolean;
    /**
     * Returns a string representation of this Point.
     */
    toString: () => string;

    /**
     * Creates a Point struct backed by the specified data.
     */
    constructor(data = new Float32Array(2)) {
        super(data);
    }

    /**
     * The X coordinate of this point.
     */
    get x() {
        return this.data[0];
    }

    /**
     * The X coordinate of this point.
     */
    set x(value: number) {
        this.data[0] = value;
    }

    /**
     * The Y coordinate of this point.
     */
    get y() {
        return this.data[1];
    }

    /**
     * The Y coordinate of this point.
     */
    set y(value: number) {
        this.data[1] = value;
    }
}

applyMixins(PointStruct, Point);
/**
 * A Point buffer backed by a Float32Array.
 */
export class PointBuffer extends StructBuffer<Float32Array> {
    /**
     * Creates an empty Point buffer with the specified Point capacity.
     */
    static create(capacity: number) {
        return new PointBuffer(new Float32Array(capacity * 2));
    }

    /**
     * Sets this point to the midpoint of p1 and p2.
     */
    setMidpoint: (p1: Point, p2: Point) => void;
    /**
     * Computes the distance between this point and the other point.
     * @param other defaults to origin.
     */
    distance: (other: Point) => number;
    /**
     * Computes the distance squared from this point to the other point.
     * @param other defaults to origin.
     */
    distance2: (other: Point) => number;
    /**
     * Sets each component of this Point to that of the other Point.
     */
    set: (other: PointLike) => void;
    /**
     * Sets each component of this Point.
     */
    set$: (x: number, y: number) => void;
    /**
     * Sets each component of this Point to the specified scalar.
     */
    setScalar: (k: number) => void;
    /**
     * Adds the other Point to this Point componentwise.
     */
    add: (other: PointLike) => void;
    /**
     * Adds the specified values to this Point componentwise.
     */
    add$: (x: number, y: number) => void;
    /**
     * Subtracts the other Point from this Point componentwise.
     */
    subtract: (other: PointLike) => void;
    /**
     * Subtracts the specified values from this Point componentwise.
     */
    subtract$: (x: number, y: number) => void;
    /**
     * Multiplies each component of this Point by the specified scalar.
     */
    mulScalar: (k: number) => void;
    /**
     * Divides each component of this Point by the specified scalar.
     */
    divScalar: (k: number) => void;
    /**
     * Checks if each component of this Point is exactly equal to that of the other Point.
     */
    equals: (other: PointLike) => boolean;
    /**
     * Checks if each component of this Point is exactly equal to the specified scalar.
     */
    equalsScalar: (k: number) => boolean;
    /**
     * Checks if each component of this Point is approximately equal to that of the other Point.
     */
    epsilonEquals: (other: PointLike, e: number) => boolean;
    /**
     * Checks if each component of this Point is approximately equal to the specified scalar.
     */
    epsilonEqualsScalar: (k: number, e: number) => boolean;
    /**
     * Returns a string representation of this Point.
     */
    toString: () => string;

    /**
     * The X coordinate of this point.
     */
    get x() {
        return this.data[this.dataPosition + 0];
    }

    /**
     * The X coordinate of this point.
     */
    set x(value: number) {
        this.data[this.dataPosition + 0] = value;
    }

    /**
     * The Y coordinate of this point.
     */
    get y() {
        return this.data[this.dataPosition + 1];
    }

    /**
     * The Y coordinate of this point.
     */
    set y(value: number) {
        this.data[this.dataPosition + 1] = value;
    }

    /**
     * Gets the number of properties in a Point, namely 2.
     */
    structLength() {
        return 2;
    }

    /**
     * Gets the components of the Point at the specified position of this buffer.
     */
    aget(position: number, dst?: PointLike) {
        if (dst === void 0){ dst = new Point()};
        let dataPos = position * this.structLength();
        dst.x = this.data[dataPos++];
        dst.y = this.data[dataPos++];
        return dst;
    }

    /**
     * Gets the components of the current Point, then moves to the next position of this buffer.
     */
    rget(position: number, dst?: PointLike) {
        if (dst === void 0){ dst = new Point()};
        dst.x = this.data[this.dataPosition++];
        dst.y = this.data[this.dataPosition++];
        return dst;
    }

    /**
     * Sets each component of the Point at the specified position to that of the src Point.
     */
    aset(position: number, src: PointLike) {
        let dataPos = position * this.structLength();
        this.data[dataPos++] = src.x;
        this.data[dataPos++] = src.y;
    }

    /**
     * Sets each component of the Point at the specified position.
     */
    aset$(position: number, x: number, y: number) {
        let dataPos = position * this.structLength();
        this.data[dataPos++] = x;
        this.data[dataPos++] = y;
    }

    /**
     * Sets each component of the current Point to that of the src Point, then moves to the next position of this buffer.
     */
    rset(src: PointLike) {
        this.data[this.dataPosition++] = src.x;
        this.data[this.dataPosition++] = src.y;
    }

    /**
     * Sets each component of the current Point, then moves to the next position of this buffer.
     */
    rset$(x: number, y: number) {
        this.data[this.dataPosition++] = x;
        this.data[this.dataPosition++] = y;
    }
}

applyMixins(PointBuffer, Point);