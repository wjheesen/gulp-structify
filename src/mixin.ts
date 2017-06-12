let ctor = "constructor";

export interface Constructor {
    prototype: Prototype;
}

export interface Prototype extends Object {
    [key: string]: any;
}

export function applyMixins(derivedCtor: Constructor, ...baseCtors: Constructor[]) {
    for(let baseCtor of baseCtors){
        for(let name of Object.getOwnPropertyNames(baseCtor.prototype)){
            if(name !== ctor){
                derivedCtor.prototype[name] = baseCtor.prototype[name];
            }
        }
    }
}