import joi from 'joi';

import { EBrand } from '../enums/brand.enum';
import { ECountry } from '../enums/country.enum';
import { ECurrency } from '../enums/currency.enum';
import { ERegion } from '../enums/region.enum';

export class CarValidator {
  static year = joi.number().min(1990).max(2023);
  static carModel = joi.string().min(2).max(30).trim();
  static brand = joi.valid(...Object.values(EBrand));
  static price = joi.number().min(1);
  static currency = joi.valid(...Object.values(ECurrency));
  static region = joi.valid(...Object.values(ERegion));
  static country = joi.valid(...Object.values(ECountry));
  static description = joi.string().min(2).max(150);
  static announcementActive = joi.boolean();
  static editCount = joi.number().min(0).max(3);

  static create = joi.object({
    brand: this.brand.required(),
    carModel: this.carModel.required(),
    year: this.year.required(),
    country: this.country.required(),
    region: this.region.required(),
    description: this.description.required(),
    currency: this.currency.required(),
    price: this.price.required(),
  });

  static update = joi.object({
    price: this.price,
    currency: this.currency,
    region: this.region,
    country: this.country,
    description: this.description,
  });

  static updateByManager = joi.object({
    price: this.price,
    currency: this.currency,
    region: this.region,
    country: this.country,
    description: this.description,
    announcementActive: this.announcementActive,
    editCount: this.editCount,
  });
}
