const { Schema, model, SchemaTypes } = require('mongoose');

const timeoutSchema = new Schema({
    from: { type: SchemaTypes.Number, default: Date.now() },
    command: { type: SchemaTypes.String, default: "" },
    user: { type: SchemaTypes.String, default: "" },
});

export default model("timeout_logs", timeoutSchema);