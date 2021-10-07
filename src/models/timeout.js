"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var _a = require('mongoose'), Schema = _a.Schema, model = _a.model, SchemaTypes = _a.SchemaTypes;
var timeoutSchema = new Schema({
    from: { type: SchemaTypes.Number, default: Date.now() },
    command: { type: SchemaTypes.String, default: "" },
    user: { type: SchemaTypes.String, default: "" },
});
exports.default = model("timeout_logs", timeoutSchema);
