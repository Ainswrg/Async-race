interface ICar {
  name: string;
  id?: string;
  color: string;
}
interface ICarRandomGenerate {
  generateRandomCar: () => string;
  generateRandomColor: () => string;
  generateCar: () => ICar;
  generateOneHundredCars: () => ICar[];
}

export { ICar, ICarRandomGenerate };
