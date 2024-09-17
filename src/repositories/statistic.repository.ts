import moment from 'moment';
import { ObjectId } from 'mongodb';

import {
  IPriceStatistic,
  IViewsStatistic,
} from '../interfaces/statistic.interface';
import { Car } from '../models/Car.model';
import { PriceStatistic } from '../models/PriceStatistic.model';
import { ViewsStatistic } from '../models/ViewsStatistic.model';

class StatisticRepository {
  public async getPriceStatisticByCarId(
    carId: string,
  ): Promise<IPriceStatistic> {
    return PriceStatistic.findOne({ carId });
  }

  public async getViewsStatisticByCarId(
    carId: string,
  ): Promise<IViewsStatistic> {
    return ViewsStatistic.findOne({ carId });
  }

  public async createPriceStatisticForCar(carId: string): Promise<void> {
    await PriceStatistic.create({ carId });
  }

  public async findAndUpdateAveragePriceInRegion(): Promise<void> {
    const averagePrices = await Car.aggregate([
      {
        $group: {
          _id: '$region',
          averagePrice: { $avg: '$priceInUAH' },
        },
      },
    ]);

    for (const region of averagePrices) {
      const carsInRegion = await Car.find({ region: region._id });

      for (const car of carsInRegion) {
        await PriceStatistic.findOneAndUpdate(
          { carId: car._id },
          {
            $set: {
              averagePriceByRegion: region.averagePrice,
            },
          },
        );
      }
    }
  }

  public async findAndUpdateAveragePriceInCountry(): Promise<void> {
    const averagePrices = await Car.aggregate([
      {
        $group: {
          _id: '$country',
          averagePrice: { $avg: '$priceInUAH' },
        },
      },
    ]);

    for (const country of averagePrices) {
      const carsInCountry = await Car.find({ country: country._id });

      for (const car of carsInCountry) {
        await PriceStatistic.findOneAndUpdate(
          { carId: car._id },
          {
            $set: {
              averagePriceForUkraine: country.averagePrice,
            },
          },
        );
      }
    }
  }

  public async createOrUpdateViews(carId: string): Promise<void> {
    const today = moment().startOf('day');

    const stat = await ViewsStatistic.findOne({
      carId,
      createdAt: { $gte: today },
    });

    if (stat) {
      await ViewsStatistic.updateOne(
        { carId, createdAt: { $gte: today } },
        { $inc: { views: 1 } },
      );
    } else {
      await ViewsStatistic.create({ carId, views: 1 });
    }
  }

  public async getDailyViews(carId: string): Promise<{ dailyViews: number }> {
    const today = moment().utc().startOf('day');
    const result = await ViewsStatistic.aggregate([
      {
        $match: {
          carId: new ObjectId(carId),
          createdAt: { $gte: today.toDate() },
        },
      },
      {
        $group: {
          _id: { $toString: '$carId' },
          dailyViews: { $sum: '$views' },
        },
      },
    ]);

    return { dailyViews: result.length > 0 ? result[0].dailyViews : 0 };
  }

  public async getWeeklyViews(carId: string): Promise<{ weeklyViews: number }> {
    const startOfWeek = moment().utc().startOf('week');
    const result = await ViewsStatistic.aggregate([
      {
        $match: {
          carId: new ObjectId(carId),
          createdAt: { $gte: startOfWeek.toDate() },
        },
      },
      {
        $group: {
          _id: { $toString: '$carId' },
          weeklyViews: { $sum: '$views' },
        },
      },
    ]);

    return { weeklyViews: result.length > 0 ? result[0].weeklyViews : 0 };
  }

  public async getMonthlyViews(
    carId: string,
  ): Promise<{ monthlyViews: number }> {
    const startOfMonth = moment().utc().startOf('month');
    const result = await ViewsStatistic.aggregate([
      {
        $match: {
          carId: new ObjectId(carId),
          createdAt: { $gte: startOfMonth.toDate() },
        },
      },
      {
        $group: {
          _id: { $toString: '$carId' },
          monthlyViews: { $sum: '$views' },
        },
      },
    ]);

    return { monthlyViews: result.length > 0 ? result[0].monthlyViews : 0 };
  }
}

export const statisticRepository = new StatisticRepository();
