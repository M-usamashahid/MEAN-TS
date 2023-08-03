import mongoose, { Schema, Document } from "mongoose";
import { sheard } from "./common";

export interface IChat extends Document {
    client: Schema.Types.ObjectId,
    user: Schema.Types.ObjectId,
    sender: Schema.Types.ObjectId,
    text: Schema.Types.String,
    audio: Schema.Types.String,
    image: Schema.Types.String,
    readed: Schema.Types.Boolean,
    order: Schema.Types.String,
    createdBy: Schema.Types.ObjectId,
    updatedBy: Schema.Types.ObjectId,
    isDeleted: Schema.Types.Boolean
}

const ChatSchema: Schema = new Schema({
    client: {
        type: Schema.Types.ObjectId,
        ref: 'clients'
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'users'
    },
    sender: {
        type: Schema.Types.String,
        default: null
    },
    group: {
        type: Schema.Types.String,
        default: null
    },
    text: {
        type: Schema.Types.String,
        default: null
    },
    image: {
        type: Schema.Types.String,
        default: null
    },
    audio: {
        type: Schema.Types.String,
        default: null
    },
    video: {
        type: Schema.Types.String,
        default: null
    },
    document: {
        type: Schema.Types.String,
        default: null
    },
    readed: {
        type: Schema.Types.Boolean,
        default: false
    },
    order: {
        type: Schema.Types.String,
        default: null
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

ChatSchema.index({
    'text': 'text'
})

export default mongoose.model<IChat>(`chats`, ChatSchema); 