import mongoose, { Schema, Document } from "mongoose";
import { sheard } from "./common";

export interface INote extends Document {
    title: Schema.Types.String,
    description: Schema.Types.String,
    client: Schema.Types.ObjectId,
    createdBy: Schema.Types.ObjectId,
    updatedBy: Schema.Types.ObjectId,
    isDeleted: Schema.Types.Boolean
}

const NoteSchema: Schema = new Schema({
    title: {
        type: Schema.Types.String,
        trim: true,
    },
    description: {
        type: Schema.Types.String,
        default: null,
    },
    client: {
        type: Schema.Types.ObjectId,
        ref: 'clients'
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

NoteSchema.index({
    'title': 'text'
})

export default mongoose.model<INote>(`notes`, NoteSchema);