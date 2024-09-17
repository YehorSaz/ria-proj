import { model, Schema } from 'mongoose';

import { ERoles } from '../enums/roles.enum';
import { EUserStatus } from '../enums/user-status.enum';
import { EUserType } from '../enums/user-type.enum';
import { IUser } from '../interfaces/users.interface';

const userSchema = new Schema(
  {
    userType: {
      type: String,
      enum: EUserType,
      required: true,
    },
    userName: {
      type: String,
    },
    age: {
      type: Number,
      min: [18, 'Minimum age is 18'],
      max: [100, 'Maximum age is 100'],
    },
    status: {
      type: String,
      enum: EUserStatus,
      required: true,
      default: EUserStatus.inactive,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    roles: {
      type: String,
      enum: ERoles,
      required: true,
    },
    avatar: {
      type: String,
    },
    isAccountPremium: {
      type: Boolean,
      required: true,
      default: false,
    },
    isBlocked: {
      type: Boolean,
      require: true,
      default: false,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

export const User = model<IUser>('user', userSchema);
