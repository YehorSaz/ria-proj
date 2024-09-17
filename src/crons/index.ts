import { updateCarPrices } from './price-currency-crons';
import { updateCarStatistic } from './update-statistics-crons';

export const cronRunner = () => {
  updateCarPrices.start();
  updateCarStatistic.start();
};
