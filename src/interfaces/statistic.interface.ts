import { Document, Types } from 'mongoose';

export interface IPriceStatistic extends Document {
  carId: Types.ObjectId;
  averagePriceByRegion: number;
  averagePriceForUkraine: number;
}

export interface IViewsStatistic extends Document {
  carId: Types.ObjectId;
  views: number;
  dailyViews?: number;
  weeklyViews?: number;
  monthlyViews?: number;
}
