import { ICar } from '../interfaces';

type TGetCars = {
  items: ICar[];
  total: string | null;
};

// eslint-disable-next-line import/prefer-default-export
export { TGetCars };
