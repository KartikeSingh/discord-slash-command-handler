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
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const timeout_1 = require("../models/timeout");
class Timeout {
    constructor(client, mongoURI = "no_uri") {
        this.client = client;
        this.mongoURI = mongoURI;
        this.cached = new Map();
        if (mongoURI !== "no_uri")
            this.connect().then(v => console.log("[ discord-slash-command-handler ] : Mongoose Database Connected Successfully")).catch(e => { throw new Error("Invalid MONGO_URI was provided in Discord-Slash-Command_handler"); });
    }
    connect() {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                (0, mongoose_1.connect)(this.mongoURI).then(v => resolve(v)).catch(e => reject(e));
            });
        });
    }
    getTimeout(user, command) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve) => __awaiter(this, void 0, void 0, function* () {
                let data = {
                    user: "1",
                    command: "1",
                    from: 0,
                };
                if (this.mongoURI === "no_uri") {
                    if (!this.cached.has(`${user}_${command}`))
                        this.cached.set(`${user}_${command}`, { from: 0, user, command });
                    data = this.cached.get(`${user}_${command}`);
                }
                else {
                    data = (yield timeout_1.default.findOne({ user, command })) || (yield timeout_1.default.create({ user, command, from: 0 }));
                }
                return resolve(data);
            }));
        });
    }
    setTimeout(user, command, time) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve) => __awaiter(this, void 0, void 0, function* () {
                let data = {
                    user: "1",
                    command: "1",
                    from: 0,
                };
                if (this.mongoURI === "no_uri") {
                    this.cached.set(`${user}_${command}`, { from: time, command, user });
                    data = this.cached.get(`${user}_${command}`);
                }
                else {
                    data = (yield timeout_1.default.findOneAndUpdate({ user, command }, { from: time })) || (yield timeout_1.default.create({ user, command, from: time }));
                }
                resolve(data);
            }));
        });
    }
}
exports.default = Timeout;
