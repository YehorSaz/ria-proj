import { Document } from 'mongoose';

import { EBrand } from '../enums/brand.enum';
import { ECountry } from '../enums/country.enum';
import { ECurrency } from '../enums/currency.enum';
import { ERegion } from '../enums/region.enum';

export interface ICar extends Document {
  _id: string;
  brand: EBrand;
  carModel: string;
  year: number;
  price: number;
  priceInUAH: number;
  currency: ECurrency;
  description?: string;
  avatar: string[];
  _userId: string;
  region: ERegion;
  country: ECountry;
  announcementActive: boolean;
  editCount: number;
  exchangeRates: {
    usd: number;
    eur: number;
    uah: number;
  };
  lastExchangeRateUpdate: Date;
}
