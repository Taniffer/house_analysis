export default function mix(...mixins) {
    class Mix {}

    for (let mixin of mixins) {
        copyProperties(Mix, mixin); // 拷贝实例属性
        copyProperties(Mix.prototype, mixin.prototype); // 拷贝原型属性
    }

    return Mix;
}

function copyProperties(target, source) {
    for (let key of Reflect.ownKeys(source)) {
        if ( key !== "constructor"
            && key !== "prototype"
            && key !== "name"
        ) {
            let desc = Object.getOwnPropertyDescriptor(source, key);
            Object.defineProperty(target, key, desc);
        }
    }
}