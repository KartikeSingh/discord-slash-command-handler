"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose = require('mongoose');
var timeout = require('../models/timeout');
var Timeout = /** @class */ (function () {
    function Timeout(client, mongoURI) {
        if (mongoURI === void 0) { mongoURI = "no_uri"; }
        this.client = client;
        this.mongoURI = mongoURI;
        this.cached = new Map();
        if (mongoURI !== "no_uri")
            this.connect().catch(function (e) { throw new Error("Invalid MONGO_URI was provided in Discord-Slash-Command_handler"); }).then(function (v) { return console.log("[ discord-slash-command-handler ] : Mongoose Database Connected Successfully"); });
    }
    Timeout.prototype.connect = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        mongoose.connect(_this.mongoURI, { useUnifiedTopology: true, useNewUrlParser: true }).then(function (v) { return resolve(v); }).catch(function (e) { return reject(e); });
                    })];
            });
        });
    };
    Timeout.prototype.getTimeout = function (user, command) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve) { return __awaiter(_this, void 0, void 0, function () {
                        var data, _a;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0:
                                    data = {
                                        user: "1",
                                        command: "1",
                                        from: 0,
                                    };
                                    if (!(this.mongoURI === "no_uri")) return [3 /*break*/, 1];
                                    if (!this.cached.has(user + "_" + command))
                                        this.cached.set(user + "_" + command, { from: 0, user: user, command: command });
                                    data = this.cached.get(user + "_" + command);
                                    return [3 /*break*/, 5];
                                case 1: return [4 /*yield*/, timeout.findOne({ user: user, command: command })];
                                case 2:
                                    _a = (_b.sent());
                                    if (_a) return [3 /*break*/, 4];
                                    return [4 /*yield*/, timeout.create({ user: user, command: command, from: 0 })];
                                case 3:
                                    _a = (_b.sent());
                                    _b.label = 4;
                                case 4:
                                    data = _a;
                                    _b.label = 5;
                                case 5: return [2 /*return*/, resolve(data)];
                            }
                        });
                    }); })];
            });
        });
    };
    Timeout.prototype.setTimeout = function (user, command, time) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve) { return __awaiter(_this, void 0, void 0, function () {
                        var data, _a;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0:
                                    data = {
                                        user: "1",
                                        command: "1",
                                        from: 0,
                                    };
                                    if (!(this.mongoURI === "no_uri")) return [3 /*break*/, 1];
                                    this.cached.set(user + "_" + command, { from: time, command: command, user: user });
                                    data = this.cached.get(user + "_" + command);
                                    return [3 /*break*/, 5];
                                case 1: return [4 /*yield*/, timeout.findOneAndUpdate({ user: user, command: command }, { from: time })];
                                case 2:
                                    _a = (_b.sent());
                                    if (_a) return [3 /*break*/, 4];
                                    return [4 /*yield*/, timeout.create({ user: user, command: command, from: time })];
                                case 3:
                                    _a = (_b.sent());
                                    _b.label = 4;
                                case 4:
                                    data = _a;
                                    _b.label = 5;
                                case 5:
                                    resolve(data);
                                    return [2 /*return*/];
                            }
                        });
                    }); })];
            });
        });
    };
    return Timeout;
}());
exports.default = Timeout;
