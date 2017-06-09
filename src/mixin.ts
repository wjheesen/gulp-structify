let ctor = "constructor";

export function applyMixins(derivedCtor: any, ...baseCtors: any[]) {
    for(let baseCtor of baseCtors){
        for(let name of Object.getOwnPropertyNames(baseCtor.prototype)){
            if(name !== ctor){
                derivedCtor.protoype[name] = baseCtor.prototype[name];
            }
        }
    }
}