import { ICarRandomGenerate, ICar } from '@core/ts/interfaces';
import carBrand from './carBrand.json';
import carModel from './carModel.json';

class CarRandomGenerate implements ICarRandomGenerate {
  public generateRandomCar = (): string => {
    const randomBrand = Math.floor(Math.random() * carBrand.length);
    const randomModal = Math.floor(Math.random() * carModel.length);
    return `${carBrand[randomBrand]} ${carModel[randomModal]}`;
  };

  public generateRandomColor = (): string => Math.floor(Math.random() * 16777215).toString(16);
  public generateCar = (): ICar => {
    const car = {
      name: this.generateRandomCar(),
      color: `#${this.generateRandomColor()}`,
    };
    return car;
  };

  public generateOneHundredCars = (): ICar[] => {
    const cars = [];
    for (let i = 0; i < 100; i += 1) {
      cars.push(this.generateCar());
    }
    return cars;
  };
}

export default CarRandomGenerate;
