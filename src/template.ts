import {TypedArray} from './typedarray'

export class Template<T extends TypedArray>{

    /**
     * Sets each component of this struct to that of the other struct.
     */
    set(other: this) { }

    /**
     * Sets each component of this struct to the specified scalar.
     */
    setScalar(k: number) {}

    /**
     * Adds the other struct to this struct componentwise.
     */
    add(other: this) {}

    /**
     * Subtracts the other struct from this struct componentwise.
     */
    subtract(other: this) {}

    /**
     * Multiplies each component of this struct by the specified scalar.
     */
    mulScalar(k: number) {}

    /**
     * Divides each component of this struct by the specified scalar.
     */
    divScalar(k: number) {}

    /**
     * Checks if each component of this struct is equal to that of the other struct.
     */
    equals(other: this) {}

    /**
     * Checks if each component of this struct is equal to the specified scalar.
     */
    equalsScalar(k: number) {}

    /**
     * Checks if each component of this struct is approximately equal to that of the other struct.
     */
    epsilonEquals(other: this, e: number) {}

    /**
     * Checks if each component of this struct is approximately equal to the specified scalar.
     */
    epsilonEqualsScalar(k: number, e: number) {}

    /**
     * Returns a string representation of this struct.
     */
    toString() {}
}

