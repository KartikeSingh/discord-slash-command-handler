"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var args = /** @class */ (function (_super) {
    __extends(args, _super);
    function args(args) {
        var _this = _super.call(this) || this;
        _this._collection = new Map();
        args === null || args === void 0 ? void 0 : args.forEach(function (v) {
            _this.push(v.value ? v.value : v);
            if (v.name) {
                _this._collection.set(v.name, v.value);
                _this[v.name] = v.value;
            }
        });
        return _this;
    }
    args.prototype.get = function (key) {
        return this._collection.get(key) || this[key];
    };
    args.prototype.toArray = function () {
        return this;
    };
    args.prototype.toMap = function () {
        return this._collection;
    };
    return args;
}(Array));
exports.default = args;
