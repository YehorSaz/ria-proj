import { NextFunction, Request, Response } from 'express';

import { statisticRepository } from '../repositories/statistic.repository';
import { statisticServices } from '../services/statistic.services';

class StatisticController {
  public async getPriceStatisticsByCarId(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { carId } = req.params;

      const statistics =
        await statisticServices.getPriceStatisticByCarId(carId);

      res.status(200).json(statistics);
    } catch (e) {
      next(e);
    }
  }

  public async getViewsStatisticsByCarId(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<any> {
    try {
      const { carId } = req.params;
      const { period } = req.query;

      if (!period) {
        const statistics =
          await statisticServices.getViewsStatisticByCarId(carId);
        return res.status(200).json(statistics);
      }

      let statistic;
      if (period === 'daily') {
        statistic = await statisticRepository.getDailyViews(carId);
      } else if (period === 'weekly') {
        statistic = await statisticRepository.getWeeklyViews(carId);
      } else if (period === 'monthly') {
        statistic = await statisticRepository.getMonthlyViews(carId);
      } else {
        return res.status(400).json({ message: 'Invalid period' });
      }

      return res.status(200).json(statistic);
    } catch (e) {
      next(e);
    }
  }
}

export const statisticController = new StatisticController();
