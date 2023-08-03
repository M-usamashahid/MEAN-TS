import mongoose, { Schema, Document } from "mongoose";
import { sheard } from "./common";

export interface IBooking extends Document {
    client: Schema.Types.ObjectId,
    schedule: Schema.Types.ObjectId,
    slot: Object,
    booking: Object,
    isDeleted: Schema.Types.Boolean
}

const booking = {
    title: {
        type: String // Full Time to display
    },
    year: {
        type: String // YYYY
    },
    month: {
        type: String // MM
    },
    day: {
        type: String // DD
    },
    weekDay: {
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

const BookingSchema: Schema = new Schema({
    client: {
        type: Schema.Types.ObjectId,
        ref: 'clients'
    },
    schedule: {
        type: Schema.Types.ObjectId,
        ref: 'schedules'
    },
    slot: {
        type: Schema.Types.Mixed
    },
    booking: booking,
    ...sheard
}, {
    timestamps: true,
    toJSON: {
        transform(doc, ret) {
            delete ret.__v;
        }
    }
});

export default mongoose.model<IBooking>(`bookings`, BookingSchema);