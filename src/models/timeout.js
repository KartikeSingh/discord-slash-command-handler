"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const timeoutSchema = new mongoose_1.Schema({
    from: { type: mongoose_1.SchemaTypes.Number, default: Date.now() },
    command: { type: mongoose_1.SchemaTypes.String, default: "" },
    user: { type: mongoose_1.SchemaTypes.String, default: "" },
});
exports.default = (0, mongoose_1.model)("timeout_logs", timeoutSchema);
