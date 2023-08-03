import mongoose, { Schema, Document } from "mongoose";
import { sheard } from "./common";

export interface IProgram extends Document {
    title: Schema.Types.String,
    createdBy: Schema.Types.ObjectId,
    updatedBy: Schema.Types.ObjectId,
    isDeleted: Schema.Types.Boolean
}

const ProgramSchema: Schema = new Schema({
    title: {
        type: Schema.Types.String,
        required: true,
        unique: true,
        trim: true,
    },
    ...sheard
}, {
    timestamps: true,
    toJSON: {
        transform(doc, ret) {
            delete ret.__v;
        }
    }
});

ProgramSchema.index({
    'title': 'text'
})

export default mongoose.model<IProgram>(`programs`, ProgramSchema);