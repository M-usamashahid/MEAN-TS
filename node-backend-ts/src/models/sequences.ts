import mongoose, { Schema, Document, Model } from "mongoose";

export interface ISequence extends Document {
    _id: String,
    sequence: Number,
    increment: any
}

interface SequenceModel extends Model<ISequence> {
    increment(query: any): any;
}

const SequenceSchema: Schema = new Schema({
    _id: {
        type: Schema.Types.String,
    },
    sequence: {
        type: Schema.Types.Number
    }
}, {
    timestamps: true,
    toJSON: {
        transform(doc, ret) {
            ret.id = ret._id;
            delete ret._id;
            delete ret.updatedAt;
            delete ret.__v;
        }
    }
});

SequenceSchema.statics.increment = function (query) {
    return new Promise((resolve, reject) => {
        this.collection.findOneAndUpdate(query, { $inc: { sequence: 1 } }, { returnDocument: 'after' },
            (err, data: any) => {
                if (!err)
                    resolve(data.value.sequence)
                else
                    reject(err)
            });
    });
};

export default mongoose.model<ISequence, SequenceModel>(`sequences`, SequenceSchema);