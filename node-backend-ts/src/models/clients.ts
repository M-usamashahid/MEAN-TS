import mongoose, { Schema, Document } from "mongoose";
import { genSaltSync, hashSync } from "bcrypt";
import { sheard } from "./common";

export enum Roles {
  user = "user"
}

export enum OrderType {
  recurring = "recurring",
  onetime = "onetime"
}
export interface IClient extends Document {
  firstName: Schema.Types.String,
  lastName: Schema.Types.String,
  email: Schema.Types.String,
  password: Schema.Types.String,
  dob: Schema.Types.Date,
  phone: Schema.Types.String,
  image: Schema.Types.String,
  token: Schema.Types.String,
  stripeCustomerId: Schema.Types.String,
  timezone: Schema.Types.String,
  suspended: Schema.Types.Boolean,
  verify: Schema.Types.Boolean,
  role: Schema.Types.String,
  stripeAccount: Schema.Types.String,
  program: Schema.Types.String,
  social: Array<Object>,
  questionnaire: Object,
  order: Object,
  onboarding: Object,
  billingAddress: Object,
  shippingAddress: Object,
  shippingAddressSameAsBilling: Schema.Types.Boolean,
  bulkImport: Schema.Types.Boolean,
  uscreen: Object,
  coin: Number,
  createdBy: Schema.Types.ObjectId,
  updatedBy: Schema.Types.ObjectId,
  isDeleted: Schema.Types.Boolean
}

const social = {
  type: {
    type: String,
    enum: ['google', 'facebook'],
    default: 'facebook'
  },
  id: {
    type: String,
    default: null
  },
  token: {
    type: String,
    default: null
  },
}

const questionnaire = {
  filled: {
    type: Schema.Types.Boolean,
    default: false
  },
  goal: {
    type: Schema.Types.String,
    default: null
  },
  age: {
    type: Schema.Types.String,
    default: null
  },
  gender: {
    type: Schema.Types.String,
    default: null
  },
  height: {
    type: Schema.Types.String,
    default: null
  },
  heightUnit: {
    type: Schema.Types.String,
    default: 'cm'
  },
  weight: {
    type: Schema.Types.String,
    default: null
  },
  weightUnit: {
    type: Schema.Types.String,
    default: 'kg'
  },
  level: {
    type: Schema.Types.String,
    default: null
  },
  weeklyExercise: {
    type: Schema.Types.String,
    default: null
  },
  habits: {
    type: Schema.Types.String,
    default: null
  },
  obstacle: {
    type: Schema.Types.String,
    default: null
  },
  achieve: {
    type: Schema.Types.String,
    default: null
  },
};

const order = {
  active: {
    type: Schema.Types.String,
    default: null
  },
  type: {
    type: Schema.Types.String,
    enum: Object.values(OrderType),
    default: 'recurring',
  },
}

const onboarding = {
  callBooked: {
    type: Schema.Types.Boolean,
    default: false
  },
  callDone: {
    type: Schema.Types.Boolean,
    default: false
  },
  coach: {
    type: Schema.Types.ObjectId,
    ref: 'users'
  },
}

const address = {
  address1: {
    type: Schema.Types.String,
    default: null
  },
  address2: {
    type: Schema.Types.String,
    default: null
  },
  city: {
    type: Schema.Types.String,
    default: null
  },
  company: {
    type: Schema.Types.String,
    default: null
  },
  state: {
    type: Schema.Types.String,
    default: null
  },
  stateCode: {
    type: Schema.Types.String,
    default: null
  },
  zip: {
    type: Schema.Types.String,
    default: null
  },
  country: {
    type: Schema.Types.String,
    default: null
  },
  countryCode: {
    type: Schema.Types.String,
    default: null
  },
  lat: {
    type: Schema.Types.String,
    default: null
  },
  lng: {
    type: Schema.Types.String,
    default: null
  }
};

const uscreen = {
  id: {
    type: Schema.Types.String,
    default: null
  },
  password: {
    type: Schema.Types.String,
    default: null
  }
}

const ClientSchema: Schema = new Schema({
  firstName: {
    type: Schema.Types.String,
    required: true
  },
  lastName: {
    type: Schema.Types.String,
    default: null
  },
  email: {
    type: Schema.Types.String,
    required: true,
    unique: true,
    trim: true,
  },
  password: {
    type: Schema.Types.String,
    trim: true,
  },
  dob: {
    type: Schema.Types.Date
  },
  phone: {
    type: Schema.Types.String,
  },
  image: {
    type: Schema.Types.String,
    default: null
  },
  token: {
    type: Schema.Types.String,
  },
  stripeCustomerId: {
    type: Schema.Types.String,
    trim: true
  },
  timezone: {
    type: Schema.Types.String,
  },
  verify: {
    type: Schema.Types.Boolean,
    default: false
  },
  suspended: {
    type: Schema.Types.Boolean,
    default: false
  },
  role: {
    type: Schema.Types.String,
    enum: Object.values(Roles),
    default: 'user'
  },
  stripeAccount: {
    type: Schema.Types.String,
    default: 'uk' // usa
  },
  program: {
    type: Schema.Types.ObjectId,
    ref: 'programs'
  },
  social: [social],
  questionnaire: questionnaire,
  order: order,
  onboarding: onboarding,
  billingAddress: address,
  shippingAddress: address,
  shippingAddressSameAsBilling: {
    type: Schema.Types.Boolean,
    default: false
  },
  bulkImport: {
    type: Schema.Types.Boolean,
    default: false
  },
  uscreen: uscreen,
  coin: {
    type: Schema.Types.Number,
    default: 500
  },
  ...sheard
}, {
  timestamps: true,
  toJSON: {
    transform(doc, ret) {
      ret.fullName = `${ret.firstName} ${ret.lastName}`
      delete ret.__v;
    }
  }
});

ClientSchema.index({
  'firstName': 'text',
  'lastName': 'text',
  'email': 'text',
  'phone': 'text',
})

ClientSchema.methods.generateHash = (password) =>
  hashSync(password, genSaltSync(10));

export default mongoose.model<IClient>(`clients`, ClientSchema);
