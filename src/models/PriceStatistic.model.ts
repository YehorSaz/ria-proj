import { model, Schema, Types } from 'mongoose';

import { Car } from './Car.model';

const priceStatisticSchema = new Schema(
  {
    carId: {
      type: Types.ObjectId,
      ref: Car,
      required: true,
    },
    averagePriceByRegion: {
      type: Number,
      default: 0,
    },
    averagePriceForUkraine: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

export const PriceStatistic = model('PriceStatistic', priceStatisticSchema);
