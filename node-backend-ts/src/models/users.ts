import mongoose, { Schema, Document } from "mongoose";
import { genSaltSync, hashSync } from "bcrypt";
import { sheard } from "./common";

export enum Roles {
  superadmin = "superadmin",
  admin = "admin",
  headcoach = "headcoach",
  coach = "coach"
}

export interface IUser extends Document {
  firstName: Schema.Types.String,
  lastName: Schema.Types.String,
  email: Schema.Types.String,
  password: Schema.Types.String,
  phone: Schema.Types.String,
  image: Schema.Types.String,
  token: Schema.Types.String,
  timezone: Schema.Types.String,
  suspended: Schema.Types.Boolean,
  role: Schema.Types.String,
  calendly: Schema.Types.String,
  createdBy: Schema.Types.ObjectId,
  updatedBy: Schema.Types.ObjectId,
  isDeleted: Schema.Types.Boolean
}

const UserSchema: Schema = new Schema({
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
  timezone: {
    type: Schema.Types.String,
  },
  suspended: {
    type: Schema.Types.Boolean,
    default: false
  },
  role: {
    type: Schema.Types.String,
    enum: Object.values(Roles),
    default: 'coach'
  },
  calendly: {
    type: Schema.Types.String,
    default: null
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

UserSchema.index({
  'firstName': 'text',
  'lastName': 'text',
  'email': 'text',
  'phone': 'text',
})

UserSchema.methods.generateHash = (password) =>
  hashSync(password, genSaltSync(10));

export default mongoose.model<IUser>(`users`, UserSchema);
