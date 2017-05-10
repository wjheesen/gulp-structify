import {Struct} from './struct'
import {TypedArray} from './typedarray'

/**
 * Helper class for working with Structs backed by a single TypedArray.
 */
export abstract class StructBuffer<T extends TypedArray> {
    
    /**
     * The primitive array data backing the Structs in this buffer.
     */
    public data: T;

    /**
     * The position of the current Struct in the backing array.
     */
    protected dataPosition: number;

    /**
     * Gets the current position of this buffer.
     */
    position() {
        return (this.dataPosition / this.structLength()) >> 0;
    }

    /**
     * Gets the maximum number of Structs this buffer can hold.
     */
    capacity() {
        return (this.data.length / this.structLength()) >> 0;
    }

    /**
     * Gets the number of components contained in each Struct of this buffer.
     */
    abstract structLength(): number;

    /**
     * Creates a buffer backed by the specified array data
     * @param data the backing array.
     * @param position the initial position of the buffer. Defaults to zero.
     */
    constructor(data: T, position = 0) {
        this.data = data;
        this.dataPosition = position * this.structLength();
    }

    /**
     * Checks if the current position of this buffer is valid.
     */
    hasValidPosition() {
        return 0 <= this.dataPosition && this.dataPosition < this.data.length;
    }

    /**
     * Moves this buffer to the specified position.
     * @returns true if an Struct exists at this position.
     */
    moveToPosition(position: number) {
        this.dataPosition = position * this.structLength();
        return this.hasValidPosition();
    }

    /**
     * Moves to the first Struct in this buffer.
     * @returns true if an Struct exists at this position.
     */
    moveToFirst() {
        this.dataPosition = 0;
        return this.dataPosition < this.data.length;
    }

    /**
     * Moves to the next Struct in this buffer.
     * @returns true if an Struct exists at this position.
     */
    moveToNext() {
        this.dataPosition += this.structLength();
        return this.hasValidPosition();
    }

    /**
     * Moves to the previous Struct in this buffer.
     * @returns true if an Struct exists at this position.
     */
    moveToPrevous() {
        this.dataPosition -= this.structLength();
        return this.hasValidPosition();
    }

    /**
     * Moves to the last Struct in this buffer.
     * @returns true if an Struct exists at this position.
     */
    moveToLast() {
        if (this.data.length) {
            // buffer has at least one Struct
            this.dataPosition = this.data.length - this.structLength();
            return true;
        } else {
            // buffer is empty
            this.dataPosition = 0;
            return false;
        }
    }

    /**
     * Copies data from the source buffer into this buffer beginning at the specified position.
     * @param position the offset into this buffer where the data should be copied.
     * @param src buffer pointing to the other Struct.
     * @param length the number of Structs to copy from the src array.
     */
    setBuffer(position: number, src: this, length: number) {
        let srcPos = src.dataPosition;
        let dstPos = position * this.structLength();
        while (length--) {
            let structLength = this.structLength();
            while (structLength--) {
                this.data[dstPos++] = src.data[srcPos++];
            }
        }
    }

    /**
     * Sets each component of the Struct at the specified position to that of the src Struct.
     * @param position the offset into this buffer where the Struct should be copied.
     * @param src buffer pointing to the other Struct.
     */
    set(position: number, src: Struct<T>) {
        let len = this.structLength();
        let srcPos = 0;
        let dstPos = position * len;
        while (len--) {
            this.data[dstPos++] = src.data[srcPos++];
        }
    }

    /**
     * Sets each Struct of this buffer to the specified Struct.
     * @param src buffer pointing to the Struct.
     */
    setEach(src: Struct<T>) {
        let dstPos = 0;
        let dstLen = this.data.length;
        while (dstLen--) {
            let srcPos = 0;
            let srcLen = this.structLength();
            while(srcLen--) {
                this.data[dstPos++] = src.data[srcPos++];
            }
        }
    }

    /**
     * Sets the current Struct to the src Struct, then moves to the next position of this buffer.
     * @param src buffer pointing to the other Struct.
     */
    put(src: Struct<T>) {
        let len = this.structLength();
        let srcPos = 0;
        while (len--) {
            this.data[this.dataPosition++] = src.data[srcPos++];
        }
    }

    /**
     * Copies data from the source buffer into this buffer at its current position, increasing the position of both buffers.
     * @param src the buffer to copy into this buffer.
     * @param length the number of Structs to copy from the src buffer.
     */
    putBuffer(src: this, length = src.capacity() - src.position()) {
        while (length--) {
            let structLength = this.structLength();
            while (structLength--) {
                this.data[this.dataPosition++] = src.data[src.dataPosition++];
            }
        }
    }

    /**
     * Checks if this buffer is exactly equal in every component to the other buffer.
     * @param other the other buffer.
     */
    equals(other: this) {
        // Check length
        if (this.data.length !== other.data.length) return false;
        // Check each component
        for (let i = 0; i < this.data.length; i++) {
            if (this.data[i] !== other.data[i]) {
                return false; // Not all equal
            }
        }
        // All equal
        return true;
    }

    /**
     * Checks if every component of this buffer is equal to the specified scalar.
     * @param k the scalar.
     */
    equalsScalar(k: number) {
        // Check each component
        for (let i = 0; i < this.data.length; i++) {
            if (this.data[i] !== k) {
                return false; // Not all equal
            }
        }
        // All equal
        return true;
    }

    /**
     * Checks if this buffer is approximately equal in every component to the other buffer.
     * @param other the other buffer.
     * @param epsilon the maximum difference allowable between each component.
     */
    epsilonEquals(other: this, epsilon: number) {
        // Check length
        if (this.data.length !== other.data.length) return false;
        // Check each component
        for (let i = 0; i < this.data.length; i++) {
            if (Math.abs(this.data[i] - other.data[i]) > epsilon) {
                return false; // Not all equal
            }
        }
        // All equal
        return true;
    }

    /**
     * Checks if every component of this buffer is approximately equal to the specified scalar.
     * @param k the scalar.
     * @param epsilon the maximum difference allowable between each component.
     */
    epsilonEqualsScalar(other: this, k: number, epsilon: number) {
        // Check each component
        for (let i = 0; i < this.data.length; i++) {
            if (Math.abs(this.data[i] - k) > epsilon) {
                return false; // Not all equal
            }
        }
        // All equal
        return true;
    }

}