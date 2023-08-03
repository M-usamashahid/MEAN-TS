import mongoose, { Schema, Document } from "mongoose";
import { sheard } from "./common";

export interface ILog extends Document {
    module: Schema.Types.String,
    action: Schema.Types.String,
    entityId: Schema.Types.String,
    title: Schema.Types.String,
    details: Schema.Types.String,
    client: Schema.Types.ObjectId,
    createdBy: Schema.Types.ObjectId,
    updatedBy: Schema.Types.ObjectId,
    isDeleted: Schema.Types.Boolean
}

const LogSchema: Schema = new Schema({
    module: {
        type: String,
        enum: [
            'client',
            'order',
            'task',
            'notes',
        ]
    },
    action: {
        type: String,
        enum: [
            'created',
            'added',
            'updated',
            'deleted',
            'cancelled',

            'assigned',
            'removed',

            'sent',
            'received',

            'archived',
            'unarchived',

            'status-changed',

            'other',
        ]
    },
    entityId: {
        type: Schema.Types.ObjectId,
    },
    title: {
        type: String
    },
    details: {
        type: String
    },
    client: {
        type: Schema.Types.ObjectId,
        ref: 'clients'
    },
    data: {
        type: Schema.Types.Mixed,
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

LogSchema.index({
    'title': 'text'
})

export default mongoose.model<ILog>(`logs`, LogSchema);