import Component from '@core/templates/component';
import { Car, GeneratorCar } from '@core/components';
import { TGetCars } from '@core/ts/types';
import EventObserver from '@core/eventObserver';
import Store from '@core/store';
import Database from '@db/index';

class Garage extends Component {
  data: TGetCars;
  event: EventObserver<unknown>;
  total: string;

  constructor(tagName: string, className: string, data: TGetCars) {
    super(tagName, className);
    this.data = data;
    this.total = this.data.total || '4';
    this.event = new EventObserver();
  }
  getGeneratorCars(): HTMLElement {
    const generator = new GeneratorCar('div', 'car-generator');
    return generator.render();
  }

  generateTitle(total: string): HTMLHeadingElement {
    const title = document.createElement('h1');
    title.classList.add('garage__title');
    const allCars = total || this.data.total;
    title.innerHTML = `Garage (${allCars})`;
    return title;
  }

  generatePageTitle(): HTMLHeadingElement {
    const title = document.createElement('h2');
    title.classList.add('garage__page-title');
    const currentPage = 1;
    title.innerHTML = `Page #${currentPage}`;
    return title;
  }

  getCar(data: TGetCars): HTMLDivElement {
    const cars = document.createElement('div');
    cars.classList.add('cars');
    const carsData = data.items;
    carsData.map((carData, index) => {
      const id = index + 1;
      const car = new Car('div', 'car', this.render, this.event);
      const currentCar: HTMLElement = car.renderCar(carData.name, carData.color, id);
      cars.append(currentCar);
      return cars;
    });
    return cars;
  }

  eventListener() {
    Store.addToStore('event', this.event);
    const dataCars = new Database();
    this.event.subscribe(async (data) => {
      if (data === 'update') {
        const db = await dataCars.getCars('garage', 1);
        this.rerender(db);
      }
    });
  }

  appendAllCars(carsData: TGetCars, total: string) {
    const containerCar = document.createElement('div');
    containerCar.classList.add('garage');

    const generatorCar = document.createElement('div');
    generatorCar.classList.add('car-generator');

    const title = this.generateTitle(total);
    const pageTitle = this.generatePageTitle();
    const cars = this.getCar(carsData);

    containerCar.append(title, pageTitle, cars);
    generatorCar.append(this.getGeneratorCars());

    this.container.append(generatorCar, containerCar);
  }

  rerender(carsData: TGetCars) {
    this.container.innerHTML = '';
    this.appendAllCars(carsData, carsData.total || this.total);
  }

  render(): HTMLElement {
    this.eventListener();
    this.appendAllCars(this.data, this.total);
    return this.container;
  }
}

export default Garage;
