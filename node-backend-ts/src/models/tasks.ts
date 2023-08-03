import mongoose, { Schema, Document } from "mongoose";
import { sheard } from "./common";

export enum Type {
    onboarding = "onboarding",
    questionnaire = "questionnaire",
    postCall = "postcall",
    call = "call",
    daily = "daily",
    weekly = "weekly",
    monthly = "monthly",
    other = "other",
}

export interface ITask extends Document {
    code: Schema.Types.Number,
    type: Schema.Types.String,
    title: Schema.Types.String,
    description: Schema.Types.String,
    eventURI: Schema.Types.String,
    cancelURI: Schema.Types.String,
    rescheduleURI: Schema.Types.String,
    parent: Schema.Types.ObjectId,
    client: Schema.Types.ObjectId,
    assignedTo: Schema.Types.ObjectId,
    dueDate: Schema.Types.Date,
    status: Object,
    completed: Schema.Types.Boolean,
    searchField: Schema.Types.String,
    createdBy: Schema.Types.ObjectId,
    updatedBy: Schema.Types.ObjectId,
    isDeleted: Schema.Types.Boolean
}

const status = {
    title: {
        type: String
    },
    statusId: {
        type: Schema.Types.ObjectId,
        ref: 'kanbans'
    }
}

const TaskSchema: Schema = new Schema({
    code: {
        type: Schema.Types.Number,
        unique: true
    },
    type: {
        type: Schema.Types.String,
        enum: Object.values(Type),
        default: "other",
    },
    title: {
        type: Schema.Types.String,
        trim: true,
        default: null,
    },
    description: {
        type: Schema.Types.String,
        trim: true,
        default: null,
    },
    eventURI: {
        type: Schema.Types.String,
        trim: true,
        default: null,
    },
    cancelURI: {
        type: Schema.Types.String,
        trim: true,
        default: null,
    },
    rescheduleURI: {
        type: Schema.Types.String,
        trim: true,
        default: null,
    },
    parent: {
        type: Schema.Types.ObjectId,
        ref: 'tasks',
        default: null
    },
    client: {
        type: Schema.Types.ObjectId,
        ref: 'clients'
    },
    assignedTo: {
        type: Schema.Types.ObjectId,
        ref: 'users'
    },
    dueDate: {
        type: Schema.Types.Date
    },
    status: status,
    completed: {
        type: Schema.Types.Boolean,
        default: false,
    },
    archive: {
        type: Schema.Types.Boolean,
        default: false,
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

TaskSchema.index({
    'title': 'text',
    'description': 'text',
})

export default mongoose.model<ITask>(`tasks`, TaskSchema);