import { Vec2, IVec2, Vec2Buffer, Vec2Struct } from './vec2';

// Vec2 object
let literal: IVec2 = { x: 0, y: 0 };
IVec2.add$(literal, 2, 2);
IVec2.normalize(literal);

// Vec2 object w/prototype
let obj = Vec2.create$(1, 0);
obj.add(literal);
obj.normalize();

// Vec2 backed by a Float32Array
let struct = Vec2Struct.create$(0, 1);
struct.add(obj);
struct.normalize();

// Vec2 buffer backed by a Float32Array
let buf = Vec2Buffer.create(3);
buf.put$(1, 2);
buf.put$(3, 4);
buf.put(struct);

// Operations on each Vec2 in buffer
while (buf.moveToPrevous()) {
    buf.$add(struct);
    buf.$normalize();
}

// Backing data (for WebGL)
let v3_data = struct.data;
let buf_data = buf.data;


