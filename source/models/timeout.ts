import { Schema, model, SchemaTypes } from 'mongoose';

const timeoutSchema = new Schema<Timeout>({
    from: { type: SchemaTypes.Number, default: Date.now() },
    command: { type: SchemaTypes.String, default: "" },
    user: { type: SchemaTypes.String, default: "" },
});

export default model<Timeout>("timeout_logs", timeoutSchema);

interface Timeout {
    user: string,
    command: string,
    from: number,
}