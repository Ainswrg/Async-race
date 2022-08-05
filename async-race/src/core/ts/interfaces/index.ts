interface ICar {
  name: string;
  id?: string;
  color: string;
  wins?: number;
  time?: number;
}
interface ICarRandomGenerate {
  generateRandomCar: () => string;
  generateRandomColor: () => string;
  generateCar: () => ICar;
  generateOneHundredCars: () => ICar[];
}

export { ICar, ICarRandomGenerate };
