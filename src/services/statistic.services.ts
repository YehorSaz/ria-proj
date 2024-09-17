import {
  IPriceStatistic,
  IViewsStatistic,
} from '../interfaces/statistic.interface';
import { statisticRepository } from '../repositories/statistic.repository';

class StatisticServices {
  public async getPriceStatisticByCarId(
    carId: string,
  ): Promise<IPriceStatistic> {
    return statisticRepository.getPriceStatisticByCarId(carId);
  }
  public async getViewsStatisticByCarId(
    carId: string,
  ): Promise<IViewsStatistic> {
    return statisticRepository.getViewsStatisticByCarId(carId);
  }
}

export const statisticServices = new StatisticServices();
