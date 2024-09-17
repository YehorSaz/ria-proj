import { model, Schema, Types } from 'mongoose';

import { EBrand } from '../enums/brand.enum';
import { ECountry } from '../enums/country.enum';
import { ECurrency } from '../enums/currency.enum';
import { ERegion } from '../enums/region.enum';
import { ICar } from '../interfaces/cars.interface';
import { User } from './User.model';

const carSchema = new Schema(
  {
    brand: {
      type: String,
      enum: EBrand,
      required: true,
    },
    carModel: {
      type: String,
      required: true,
    },
    year: {
      type: Number,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    priceInUAH: {
      type: Number,
    },
    currency: {
      type: String,
      enum: ECurrency,
      required: true,
    },
    description: {
      type: String,
    },
    avatar: [
      {
        type: String,
      },
    ],
    _userId: {
      type: Types.ObjectId,
      required: true,
      ref: User,
    },
    region: {
      type: String,
      enum: ERegion,
      required: true,
    },
    country: {
      type: String,
      enum: ECountry,
      required: true,
      unique: true,
    },
    announcementActive: {
      type: Boolean,
      required: true,
      default: false,
    },
    editCount: {
      type: Number,
      default: 0,
    },
    exchangeRates: {
      usd: {
        type: Number,
      },
      eur: {
        type: Number,
      },
      uah: {
        type: Number,
      },
    },
    lastExchangeRateUpdate: {
      type: Date,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

export const Car = model<ICar>('car', carSchema);
