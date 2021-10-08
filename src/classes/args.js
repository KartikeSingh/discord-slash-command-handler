"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class args extends Array {
    constructor(args) {
        super();
        this._collection = new Map();
        args === null || args === void 0 ? void 0 : args.forEach(v => {
            this.push(v.value ? v.value : v);
            if (v.name) {
                this._collection.set(v.name, v.value);
                this[v.name] = v.value;
            }
        });
    }
    get(key) {
        return this._collection.get(key) || this[key];
    }
    toArray() {
        return this;
    }
    toMap() {
        return this._collection;
    }
}
exports.default = args;
