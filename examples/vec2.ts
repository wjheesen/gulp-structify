// THIS IS AN AUTOGENERATED FILE. DO NOT EDIT THIS FILE DIRECTLY.
import {Point} from "./point";
import {Structure} from "gulp-structify/struct";
import {StructureBuffer} from "gulp-structify/buf";

/**
 * A two-dimensional vector with (x,y) components.
 */
export interface Vec2 {
    /**
     * The X component of this Vec2.
     */
    x: number;
    /**
     * The Y component of this Vec2.
     */
    y: number;
}

export namespace Vec2 {
    /**
     * Sets each component of this Vec2 to that of the other Vec2.
     */
    export function set(_this: Vec2, other: Vec2) {
        _this.x = other.x;
        _this.y = other.y;
    }

    /**
     * Sets each component of this Vec2.
     */
    export function set$(_this: Vec2, x: number, y: number) {
        _this.x = x;
        _this.y = y;
    }

    /**
     * Adds the other Vec2 to this Vec2 componentwise.
     */
    export function add(_this: Vec2, other: Vec2) {
        _this.x += other.x;
        _this.y += other.y;
    }

    /**
     * Adds the specified values to this Vec2 componentwise.
     */
    export function add$(_this: Vec2, x: number, y: number) {
        _this.x += x;
        _this.y += y;
    }

    /**
     * Subtracts the other Vec2 from this Vec2 componentwise.
     */
    export function subtract(_this: Vec2, other: Vec2) {
        _this.x -= other.x;
        _this.y -= other.y;
    }

    /**
     * Subtracts the specified values from this Vec2 componentwise.
     */
    export function subtract$(_this: Vec2, x: number, y: number) {
        _this.x -= x;
        _this.y -= y;
    }

    /**
     * Multiplies each component of this Vec2 by the specified scalar.
     */
    export function mulScalar(_this: Vec2, k: number) {
        _this.x *= k;
        _this.y *= k;
    }

    /**
     * Divides each component of this Vec2 by the specified scalar.
     */
    export function divScalar(_this: Vec2, k: number) {
        _this.x /= k;
        _this.y /= k;
    }

    /**
     * Checks if each component of this Vec2 is equal to that of the other Vec2.
     */
    export function equals(_this: Vec2, other: Vec2) {
        return _this.x === other.x && _this.y === other.y;
    }

    /**
     * Checks if each component of this Vec2 is equal to the specified scalar.
     */
    export function equalsScalar(_this: Vec2, k: number) {
        return _this.x === k && _this.y === k;
    }

    /**
     * Checks if each component of this Vec2 is approximately equal to that of the other Vec2.
     */
    export function epsilonEquals(_this: Vec2, other: Vec2, e: number) {
        return Math.abs(_this.x - other.x) <= e && Math.abs(_this.y - other.y) <= e;
    }

    /**
     * Checks if each component of this Vec2 is approximately equal to the specified scalar.
     */
    export function epsilonEqualsScalar(_this: Vec2, k: number, e: number) {
        return Math.abs(_this.x - k) <= e && Math.abs(_this.y - k) <= e;
    }

    /**
     * Returns a string representation of this Vec2.
     */
    export function toString(_this: Vec2) {
        return `{ x: ${_this.x}, y: ${_this.y} }`
    }

    /**
     * Computes the length of this Vec2.
     */
    export function length(_this: Vec2) {
        return Math.sqrt(length2(_this, ));
    }

    /**
     * Computes the length squared of this Vec2.
     */
    export function length2(_this: Vec2) {
        return _this.x * _this.x + _this.y * _this.y;
    }

    /**
     * Sets this Vec2 to a vector from the initial point to the terminal point. 
     */
    export function setFromPointToPoint(_this: Vec2, initial: Point, terminal: Point) {
        _this.x = terminal.x - initial.x;
        _this.y = terminal.y - initial.y;
    }

    /**
     * Computes the dot product of this Vec2 with the other Vec2.
     */
    export function dot(_this: Vec2, other: Vec2) {
        return _this.x * other.x + _this.y * other.y;
    }

    /**
     * Computes the cross product of this Vec2 with the other Vec2.
     */
    export function cross(_this: Vec2, other: Vec2) {
        return (_this.x * other.y) - (other.x * _this.y);
    }

    /**
     * Normalizes this Vec2 so that it has a length of one.
     */
    export function normalize(_this: Vec2) {
        divScalar(_this, length(_this, ));
    }

    /**
     * Rotates this Vec2 90 degrees to the left (CCW).
     */
    export function rotateLeft(_this: Vec2) {
        let x = _this.x;
        _this.x = -_this.y;
        _this.y = x;
    }

    /**
     * Rotates this Vec2 90 degrees to the right (CW).
     */
    export function rotateRight(_this: Vec2) {
        let x = _this.x;
        _this.x = _this.y;
        _this.y = -x;
    }

    /**
     * A two-dimensional vector with (x,y) components.
     */
    export class Obj {
        static create(other: Vec2) {
            let Vec2 = new Obj();
            Vec2.set(other);
            return Vec2;
        }

        static create$(x: number, y: number) {
            let Vec2 = new Obj();
            Vec2.set$(x, y);
            return Vec2;
        }

        static fromPointToPoint(initial: Point, terminal: Point) {
            let Vec2 = new Obj();
            Vec2.setFromPointToPoint(initial, terminal);
            return Vec2;
        }

        /**
         * The X component of this Vec2.
         */
        x: number;
        /**
         * The Y component of this Vec2.
         */
        y: number;

        /**
         * Sets each component of this Vec2 to that of the other Vec2.
         */
        set(other: Vec2) {
            return set(this, other);
        }

        /**
         * Sets each component of this Vec2.
         */
        set$(x: number, y: number) {
            return set$(this, x, y);
        }

        /**
         * Adds the other Vec2 to this Vec2 componentwise.
         */
        add(other: Vec2) {
            return add(this, other);
        }

        /**
         * Adds the specified values to this Vec2 componentwise.
         */
        add$(x: number, y: number) {
            return add$(this, x, y);
        }

        /**
         * Subtracts the other Vec2 from this Vec2 componentwise.
         */
        subtract(other: Vec2) {
            return subtract(this, other);
        }

        /**
         * Subtracts the specified values from this Vec2 componentwise.
         */
        subtract$(x: number, y: number) {
            return subtract$(this, x, y);
        }

        /**
         * Multiplies each component of this Vec2 by the specified scalar.
         */
        mulScalar(k: number) {
            return mulScalar(this, k);
        }

        /**
         * Divides each component of this Vec2 by the specified scalar.
         */
        divScalar(k: number) {
            return divScalar(this, k);
        }

        /**
         * Checks if each component of this Vec2 is equal to that of the other Vec2.
         */
        equals(other: Vec2) {
            return equals(this, other);
        }

        /**
         * Checks if each component of this Vec2 is equal to the specified scalar.
         */
        equalsScalar(k: number) {
            return equalsScalar(this, k);
        }

        /**
         * Checks if each component of this Vec2 is approximately equal to that of the other Vec2.
         */
        epsilonEquals(other: Vec2, e: number) {
            return epsilonEquals(this, other, e);
        }

        /**
         * Checks if each component of this Vec2 is approximately equal to the specified scalar.
         */
        epsilonEqualsScalar(k: number, e: number) {
            return epsilonEqualsScalar(this, k, e);
        }

        /**
         * Returns a string representation of this Vec2.
         */
        toString() {
            return toString(this);
        }

        /**
         * Computes the length of this Vec2.
         */
        length() {
            return length(this);
        }

        /**
         * Computes the length squared of this Vec2.
         */
        length2() {
            return length2(this);
        }

        /**
         * Sets this Vec2 to a vector from the initial point to the terminal point. 
         */
        setFromPointToPoint(initial: Point, terminal: Point) {
            return setFromPointToPoint(this, initial, terminal);
        }

        /**
         * Computes the dot product of this Vec2 with the other Vec2.
         */
        dot(other: Vec2) {
            return dot(this, other);
        }

        /**
         * Computes the cross product of this Vec2 with the other Vec2.
         */
        cross(other: Vec2) {
            return cross(this, other);
        }

        /**
         * Normalizes this Vec2 so that it has a length of one.
         */
        normalize() {
            return normalize(this);
        }

        /**
         * Rotates this Vec2 90 degrees to the left (CCW).
         */
        rotateLeft() {
            return rotateLeft(this);
        }

        /**
         * Rotates this Vec2 90 degrees to the right (CW).
         */
        rotateRight() {
            return rotateRight(this);
        }
    }

    /**
     * A Vec2 backed by a Float32Array.
     */
    export class Struct extends Structure<Float32Array> {
        static create(other: Vec2) {
            let Vec2 = new Struct();
            Vec2.set(other);
            return Vec2;
        }

        static create$(x: number, y: number) {
            let Vec2 = new Struct();
            Vec2.set$(x, y);
            return Vec2;
        }

        static fromPointToPoint(initial: Point, terminal: Point) {
            let Vec2 = new Struct();
            Vec2.setFromPointToPoint(initial, terminal);
            return Vec2;
        }

        /**
         * Creates a Vec2 struct.
         */
        constructor() {
            super(new Float32Array(2));
        }

        /**
         * The X component of this Vec2.
         */
        get x() {
            return this.data[0];
        }

        /**
         * The X component of this Vec2.
         */
        set x(value: number) {
            this.data[0] = value;
        }

        /**
         * The Y component of this Vec2.
         */
        get y() {
            return this.data[1];
        }

        /**
         * The Y component of this Vec2.
         */
        set y(value: number) {
            this.data[1] = value;
        }

        /**
         * Sets each component of this Vec2 to that of the other Vec2.
         */
        set(other: Vec2) {
            return set(this, other);
        }

        /**
         * Sets each component of this Vec2.
         */
        set$(x: number, y: number) {
            return set$(this, x, y);
        }

        /**
         * Adds the other Vec2 to this Vec2 componentwise.
         */
        add(other: Vec2) {
            return add(this, other);
        }

        /**
         * Adds the specified values to this Vec2 componentwise.
         */
        add$(x: number, y: number) {
            return add$(this, x, y);
        }

        /**
         * Subtracts the other Vec2 from this Vec2 componentwise.
         */
        subtract(other: Vec2) {
            return subtract(this, other);
        }

        /**
         * Subtracts the specified values from this Vec2 componentwise.
         */
        subtract$(x: number, y: number) {
            return subtract$(this, x, y);
        }

        /**
         * Multiplies each component of this Vec2 by the specified scalar.
         */
        mulScalar(k: number) {
            return mulScalar(this, k);
        }

        /**
         * Divides each component of this Vec2 by the specified scalar.
         */
        divScalar(k: number) {
            return divScalar(this, k);
        }

        /**
         * Checks if each component of this Vec2 is equal to that of the other Vec2.
         */
        equals(other: Vec2) {
            return equals(this, other);
        }

        /**
         * Checks if each component of this Vec2 is equal to the specified scalar.
         */
        equalsScalar(k: number) {
            return equalsScalar(this, k);
        }

        /**
         * Checks if each component of this Vec2 is approximately equal to that of the other Vec2.
         */
        epsilonEquals(other: Vec2, e: number) {
            return epsilonEquals(this, other, e);
        }

        /**
         * Checks if each component of this Vec2 is approximately equal to the specified scalar.
         */
        epsilonEqualsScalar(k: number, e: number) {
            return epsilonEqualsScalar(this, k, e);
        }

        /**
         * Returns a string representation of this Vec2.
         */
        toString() {
            return toString(this);
        }

        /**
         * Computes the length of this Vec2.
         */
        length() {
            return length(this);
        }

        /**
         * Computes the length squared of this Vec2.
         */
        length2() {
            return length2(this);
        }

        /**
         * Sets this Vec2 to a vector from the initial point to the terminal point. 
         */
        setFromPointToPoint(initial: Point, terminal: Point) {
            return setFromPointToPoint(this, initial, terminal);
        }

        /**
         * Computes the dot product of this Vec2 with the other Vec2.
         */
        dot(other: Vec2) {
            return dot(this, other);
        }

        /**
         * Computes the cross product of this Vec2 with the other Vec2.
         */
        cross(other: Vec2) {
            return cross(this, other);
        }

        /**
         * Normalizes this Vec2 so that it has a length of one.
         */
        normalize() {
            return normalize(this);
        }

        /**
         * Rotates this Vec2 90 degrees to the left (CCW).
         */
        rotateLeft() {
            return rotateLeft(this);
        }

        /**
         * Rotates this Vec2 90 degrees to the right (CW).
         */
        rotateRight() {
            return rotateRight(this);
        }
    }

    /**
     * A Vec2 buffer backed by a Float32Array.
     */
    export class Buf extends StructureBuffer<Float32Array> {
        /**
         * Creates an empty Vec2 buffer with the specified Vec2 capacity.
         */
        static create(capacity: number) {
            return new Buf(new Float32Array(capacity * 2));
        }

        /**
         * The X component of the current Vec2.
         */
        get x() {
            return this.data[this.dataPosition + 0];
        }

        /**
         * The X component of the current Vec2.
         */
        set x(value: number) {
            this.data[this.dataPosition + 0] = value;
        }

        /**
         * The Y component of the current Vec2.
         */
        get y() {
            return this.data[this.dataPosition + 1];
        }

        /**
         * The Y component of the current Vec2.
         */
        set y(value: number) {
            this.data[this.dataPosition + 1] = value;
        }

        /**
         * Gets the number of components in a Vec2, namely 2.
         */
        structLength() {
            return 2;
        }

        /**
         * Sets each component of the Vec2 at the specified position.
         */
        set$(position: number, x: number, y: number) {
            let dataPos = position * this.structLength();
            this.data[dataPos++] = x;
            this.data[dataPos++] = y;
        }

        /**
         * Sets each component of the current Vec2, then moves to the next position of this buffer.
         */
        put$(x: number, y: number) {
            this.data[this.dataPosition++] = x;
            this.data[this.dataPosition++] = y;
        }

        /**
         * Sets each component of the current Vec2 to that of the other Vec2.
         */
        $set(other: Vec2) {
            return set(this, other);
        }

        /**
         * Sets each component of the current Vec2.
         */
        $set$(x: number, y: number) {
            return set$(this, x, y);
        }

        /**
         * Adds the other Vec2 to the current Vec2 componentwise.
         */
        $add(other: Vec2) {
            return add(this, other);
        }

        /**
         * Adds the specified values to the current Vec2 componentwise.
         */
        $add$(x: number, y: number) {
            return add$(this, x, y);
        }

        /**
         * Subtracts the other Vec2 from the current Vec2 componentwise.
         */
        $subtract(other: Vec2) {
            return subtract(this, other);
        }

        /**
         * Subtracts the specified values from the current Vec2 componentwise.
         */
        $subtract$(x: number, y: number) {
            return subtract$(this, x, y);
        }

        /**
         * Multiplies each component of the current Vec2 by the specified scalar.
         */
        $mulScalar(k: number) {
            return mulScalar(this, k);
        }

        /**
         * Divides each component of the current Vec2 by the specified scalar.
         */
        $divScalar(k: number) {
            return divScalar(this, k);
        }

        /**
         * Checks if each component of the current Vec2 is equal to that of the other Vec2.
         */
        $equals(other: Vec2) {
            return equals(this, other);
        }

        /**
         * Checks if each component of the current Vec2 is equal to the specified scalar.
         */
        $equalsScalar(k: number) {
            return equalsScalar(this, k);
        }

        /**
         * Checks if each component of the current Vec2 is approximately equal to that of the other Vec2.
         */
        $epsilonEquals(other: Vec2, e: number) {
            return epsilonEquals(this, other, e);
        }

        /**
         * Checks if each component of the current Vec2 is approximately equal to the specified scalar.
         */
        $epsilonEqualsScalar(k: number, e: number) {
            return epsilonEqualsScalar(this, k, e);
        }

        /**
         * Returns a string representation of the current Vec2.
         */
        $toString() {
            return toString(this);
        }

        /**
         * Computes the length of the current Vec2.
         */
        $length() {
            return length(this);
        }

        /**
         * Computes the length squared of the current Vec2.
         */
        $length2() {
            return length2(this);
        }

        /**
         * Sets the current Vec2 to a vector from the initial point to the terminal point. 
         */
        $setFromPointToPoint(initial: Point, terminal: Point) {
            return setFromPointToPoint(this, initial, terminal);
        }

        /**
         * Computes the dot product of the current Vec2 with the other Vec2.
         */
        $dot(other: Vec2) {
            return dot(this, other);
        }

        /**
         * Computes the cross product of the current Vec2 with the other Vec2.
         */
        $cross(other: Vec2) {
            return cross(this, other);
        }

        /**
         * Normalizes the current Vec2 so that it has a length of one.
         */
        $normalize() {
            return normalize(this);
        }

        /**
         * Rotates the current Vec2 90 degrees to the left (CCW).
         */
        $rotateLeft() {
            return rotateLeft(this);
        }

        /**
         * Rotates the current Vec2 90 degrees to the right (CW).
         */
        $rotateRight() {
            return rotateRight(this);
        }
    }
}
