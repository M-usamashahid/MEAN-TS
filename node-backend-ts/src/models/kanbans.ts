import mongoose, { Schema, Document } from "mongoose";
import { sheard } from "./common";

export interface IKanban extends Document {
    title: Schema.Types.String,
    default: Schema.Types.Boolean,
    order: Schema.Types.Number,
    tasks: Array<Object>,
    createdBy: Schema.Types.ObjectId,
    updatedBy: Schema.Types.ObjectId,
    isDeleted: Schema.Types.Boolean
}

const task = new Schema({
    taskId: {
        type: Schema.Types.ObjectId,
        ref: 'tasks'
    },
    client: {
        type: Schema.Types.ObjectId,
        ref: 'clients',
        default: null
    },
    assignedTo: {
        type: Schema.Types.ObjectId,
        ref: 'users'
    },
}, {
    _id: true
})

const KanbanSchema: Schema = new Schema({
    title: {
        type: String,
        trim: true,
    },
    default: {
        type: Boolean,
        default: false
    },
    order: {
        type: Number,
        default: 0
    },
    tasks: [task],
    ...sheard
}, {
    timestamps: true,
    toJSON: {
        transform(doc, ret) {
            delete ret.__v;
        }
    }
});

export default mongoose.model<IKanban>(`kanbans`, KanbanSchema);