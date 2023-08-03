import mongoose, { Schema, Document } from "mongoose";
import { sheard } from "./common";

export interface IProduct extends Document {
    title: Schema.Types.String,
    description: Schema.Types.String,
    statementDescriptor: Schema.Types.String,
    unitLabel: Schema.Types.String,
    stripeProductId: Schema.Types.String,
    price: Array<Object>,
    createdBy: Schema.Types.ObjectId,
    updatedBy: Schema.Types.ObjectId,
    isDeleted: Schema.Types.Boolean
}

export enum ProductType {
    recurring = "recurring",
    onetime = "onetime"
}

const price = {
    stripePriceId: {
        type: Schema.Types.String,
        default: null
    },
    title: {
        type: Schema.Types.String,
        default: null
    },
    description: {
        type: Schema.Types.String,
        default: null
    },
    active: {
        type: Schema.Types.Boolean,
        default: true
    },
    physical: {
        type: Schema.Types.Boolean,
        default: false
    },
    product: {
        type: Schema.Types.String,
        default: null,
    },
    currency: {
        type: Schema.Types.String,
        default: 'USD',
    },
    type: {
        type: Schema.Types.String,
        default: 'recurring',
    },
    unitAmount: {
        type: Schema.Types.Number,
        default: 0
    },
    unitAmountDecimal: {
        type: Schema.Types.String,
        default: null
    },
    recurring: {
        interval: {
            type: Schema.Types.String,
            default: null
        },
        intervalCount: {
            type: Schema.Types.Number,
            default: 1
        }
    }
};

const ProductSchema: Schema = new Schema({
    title: {
        type: Schema.Types.String,
        trim: true,
    },
    description: {
        type: Schema.Types.String,
        default: null,
    },
    statementDescriptor: {
        type: Schema.Types.String,
        default: null,
        trim: true,
    },
    unitLabel: {
        type: Schema.Types.String,
        default: null,
        trim: true,
    },
    stripeProductId: {
        type: Schema.Types.String,
        default: null,
        trim: true
    },
    price: [price],
    type: {
        type: Schema.Types.String,
        enum: Object.values(ProductType),
        default: 'recurring',
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

ProductSchema.index({
    'title': 'text'
})

export default mongoose.model<IProduct>(`products`, ProductSchema);