interface ICar {
  name: string;
  id?: string;
  color: string;
  wins?: number;
  time?: number;
  state?: { velocity: number; distance: number };
}
interface ICarRandomGenerate {
  generateRandomCar: () => string;
  generateRandomColor: () => string;
  generateCar: () => ICar;
  generateOneHundredCars: () => ICar[];
}

interface IPaginationGenerator {
  getRange(start: number, end: number): number[];
  clamp(number: number, lower: number, upper: number): number;
  generate(): Array<string | number>;
}

export { ICar, ICarRandomGenerate, IPaginationGenerator };
