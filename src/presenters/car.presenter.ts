import { configs } from '../configs/configs';
import { ICar } from '../interfaces/cars.interface';

interface IPresenter<I, O> {
  present(payload: I): O;
}

class CarPresenter implements IPresenter<ICar, Partial<ICar>> {
  present(data: ICar): Partial<ICar> {
    const avatars = Array.isArray(data.avatar) ? data.avatar : [data.avatar];
    return {
      _id: data._id,
      carModel: data.carModel,
      year: data.year,
      price: data.price,
      currency: data.currency,
      description: data.description,
      avatar: avatars.map((avatar) => `${configs.AWS_S3_URL}/${avatar}`),
      _userId: data._userId,
    };
  }
}

export const carPresenter = new CarPresenter();
