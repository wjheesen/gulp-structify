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
     * Gets the number of components contained in each Struct of this buffer.
     */
    abstract structLength(): number;

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
    setFromBuffer(position: number, src: this, length: number) {
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
    setFromStruct(position: number, src: Struct<T>) {
        let len = this.structLength();
        let srcPos = 0;
        let dstPos = position * len;
        while (len--) {
            this.data[dstPos++] = src.data[srcPos++];
        }
    }

    /**
     * Sets each Struct in this buffer to the specified struct.
     * @param src the struct or the buffer pointing to the struct.
     */
    setEachStruct(src: Struct<T> | this) {
        let dstPos = 0;
        let dstLen = this.data.length;
        while (dstLen--) {
            let srcPos = (<this>src).dataPosition || 0;
            let srcLen = this.structLength();
            while(srcLen--) {
                this.data[dstPos++] = src.data[srcPos++];
            }
        }
    }

    /**
     * Sets the current struct to the src struct, then moves to the next position of this buffer.
     * @param src the struct or the buffer pointing to the struct.
     */
    putStruct(src: Struct<T> | this) {
        let len = this.structLength();
        let srcPos = (<this>src).dataPosition || 0;
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
}