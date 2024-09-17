import { model, Schema, Types } from 'mongoose';

import { EActionTokenType } from '../enums/actionTokenType';
import { IActionToken } from '../interfaces/token.interface';
import { User } from './User.model';

const tokensSchema = new Schema(
  {
    token: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: EActionTokenType,
      required: true,
    },
    _userId: {
      type: Types.ObjectId,
      required: true,
      ref: User,
    },
  },
  { timestamps: true, versionKey: false },
);

export const ActionTokenModel = model<IActionToken>(
  'action-token',
  tokensSchema,
);
