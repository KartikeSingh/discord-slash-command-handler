const { Schema, model, SchemaTypes } = require('mongoose');

const timeoutSchema = new Schema({
    at: { type: SchemaTypes.Number, default: Date.now() },
    command: { type: SchemaTypes.String, default: "" },
    user: { type: SchemaTypes.String, default: "" },
});

module.exports = model("timeout_logs",timeoutSchema);