import {TypedArray} from './typedarray'

/**
 * Struct backed by a TypedArray.
 */
export class Structure<T extends TypedArray> {
    
    /**
     * The TypedArray backing this item.
     */
    public data: T;

    /**
     * Creates a struct backed by a TypedArray.
     * @param data the backing array.
     */
    constructor(data: T) {
        this.data = data;
    }

}

