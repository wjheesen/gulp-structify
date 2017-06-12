/**
 * Parameter decoration indicating that parameter can be of any type that implements the "ObjectLike" interface generated by gulp-structify.
 * For example, `dot: (@like other: Vec2) => number` compiles to `dot: (other: Vec2Like) => number`.
 */
export function like(target: Object, propertyKey: string | symbol, parameterIndex: number) {
}