import mongoose, { Schema, Document } from "mongoose";
import { sheard } from "./common";

export interface ISchedule extends Document {
    title: Schema.Types.String,
    description: Schema.Types.String,
    client: Schema.Types.ObjectId,
    createdBy: Schema.Types.ObjectId,
    updatedBy: Schema.Types.ObjectId,
    isDeleted: Schema.Types.Boolean
}

const time = {
    year: {
        type: String // YYYY
    },
    month: {
        type: String // MM
    },
    day: {
        type: String // DD
    },
    hour: {
        type: String // HH
    },
    min: {
        type: String // mm
    },
    timezone: {
        type: String // GMT-0
    },
}

const zoom = {
    id: {
        type: Schema.Types.String,
        default: null
    },
    password: {
        type: Schema.Types.String,
        default: null
    },
    link: {
        type: Schema.Types.String,
        default: null
    },
}

const ScheduleSchema: Schema = new Schema({
    title: {
        type: Schema.Types.String,
        trim: true,
    },
    description: {
        type: Schema.Types.String,
        default: null,
    },
    type: {
        type: Schema.Types.String,
        enum: ['ezToned-xtreme', 'ezToned-range'],
        default: 'ezToned-xtreme'
    },
    day: {
        type: Schema.Types.String,
        enum: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
        default: 'monday'
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'users'
    },
    zoom: zoom,
    start: time,
    end: time,
    deuration: {
        type: Schema.Types.Number // Minutes
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

ScheduleSchema.index({
    'title': 'text',
    'description': 'text',
    'day': 'text',
})

export default mongoose.model<ISchedule>(`schedules`, ScheduleSchema);