import mongoose, { Schema, Document } from "mongoose";
import { sheard } from "./common";

export interface IOrder extends Document {
    client: Schema.Types.ObjectId,
    firstName: Schema.Types.String,
    lastName: Schema.Types.String,
    phone: Schema.Types.String,
    stripePaymentMethodId: Schema.Types.String,
    item: Array<Object>,
    total: Object,
    billingAddress: Object,
    shippingAddress: Object,
    shippingAddressSameAsBilling: Schema.Types.Boolean,
    completed: Schema.Types.Boolean,
    createdBy: Schema.Types.ObjectId,
    updatedBy: Schema.Types.ObjectId,
    isDeleted: Schema.Types.Boolean
}

const item = {
    type: {
        type: Schema.Types.String,
        enum: ['product', 'subscription', 'subscription-live'],
        default: 'subscription'
    },
    status: {
        type: Schema.Types.String,
        enum: ['unpaid', 'active', 'cancelled', 'cancel-requested'],
    },
    title: {
        type: Schema.Types.String,
        default: null
    },
    product: {
        type: Schema.Types.Mixed,
    },
    productId: {
        type: Schema.Types.ObjectId,
        ref: 'products',
        default: null
    },
    billingType: {
        type: Schema.Types.String,
        default: null
    },
    // Depracted
    subscriptionType: {
        type: Schema.Types.String,
        default: null
    },
    price: {
        type: Schema.Types.Mixed,
        default: null
    },
    unitAmount: {
        type: Number,
        default: 0
    },
    weeklyClasses: {
        type: Number,
        default: 0
    },
    stripePriceId: {
        type: Schema.Types.String,
        default: null
    },
    stripeSubscriptionId: {
        type: Schema.Types.String,
        default: null
    },
    shopifyOrderId: {
        type: Schema.Types.String,
        default: null
    },
    orderTrackingId: {
        type: Schema.Types.String,
        default: null
    },
    orderTrackingURL: {
        type: Schema.Types.String,
        default: null
    },
    cancelledAt: {
        type: Schema.Types.Date,
        default: null
    },
    cancelRequestedAt: {
        type: Schema.Types.Date,
        default: null
    },
    cancelApprovedAt: {
        type: Schema.Types.Date,
        default: null
    },
    cancelReason: {
        type: Schema.Types.String,
        default: null
    },
    taxrate: {},
    priceCopy: {},
    active: {
        type: Schema.Types.Boolean,
        default: false
    },
    physical: {
        type: Schema.Types.Boolean,
        default: false
    },
};

const total = {
    amount: {
        type: Number,
        default: 0
    },
    afterDiscount: {
        type: Number,
        default: 0
    },
    discountedAmount: {
        type: Number,
        default: 0
    },
    afterTax: {
        type: Number,
        default: 0
    },
    taxAmount: {
        type: Number,
        default: 0
    },
    currency: {
        type: Schema.Types.String,
        default: 'usd'
    },
    appliedTaxrates: [],
    taxBreakdown: [],
}

const address = {
    address1: {
        type: String,
        default: null
    },
    address2: {
        type: String,
        default: null
    },
    city: {
        type: String,
        default: null
    },
    company: {
        type: String,
        default: null
    },
    state: {
        type: String,
        default: null
    },
    stateCode: {
        type: String,
        default: null
    },
    zip: {
        type: String,
        default: null
    },
    country: {
        type: String,
        default: null
    },
    countryCode: {
        type: String,
        default: null
    },
    lat: {
        type: String,
        default: null
    },
    lng: {
        type: String,
        default: null
    }
};

const OrderSchema: Schema = new Schema({
    client: {
        type: Schema.Types.ObjectId,
        ref: 'clients'
    },
    firstName: {
        type: Schema.Types.String,
        default: null
    },
    lastName: {
        type: Schema.Types.String,
        default: null
    },
    phone: {
        type: Schema.Types.String,
        default: null
    },
    stripePaymentMethodId: {
        type: Schema.Types.String,
        default: null
    },
    paymentMethodType: {
        type: Schema.Types.String,
        default: 'card'
    },
    allowedPaymentMethods: [],
    items: [item],
    total: total,
    shippingAddress: address,
    billingAddress: address,
    shippingAddressSameAsBilling: {
        type: Schema.Types.Boolean,
        default: true
    },
    completed: {
        type: Schema.Types.Boolean,
        default: false
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

export default mongoose.model<IOrder>(`orders`, OrderSchema);