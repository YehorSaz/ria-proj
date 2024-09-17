import { model, Schema, Types } from 'mongoose';

import { Car } from './Car.model';

const ViewsStatisticSchema = new Schema(
  {
    carId: {
      type: Types.ObjectId,
      ref: Car,
      required: true,
    },
    views: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

export const ViewsStatistic = model('ViewsStatistic', ViewsStatisticSchema);
