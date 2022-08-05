import { ICar } from '@core/ts/interfaces';
import { Endpoint, DefaultConst, Engine } from '@core/ts/enum';
import Component from '@core/templates/component';
import { Car, GeneratorCar } from '@core/components';
import { TGetCars } from '@core/ts/types';
import EventObserver from '@core/eventObserver';
import Store from '@core/store';
import Database from '@db/index';
import getPaginationGenerator from '@helpers/paginate';

interface IStateCar {
  id: number;
  finish?: boolean | undefined;
  distance?: number | undefined;
  time: number;
}

// ToDo разделить в разные файлы
class Garage extends Component {
  data: TGetCars;
  event: EventObserver<unknown>;
  total: string;
  db: Database;
  isPushRace: boolean;

  constructor(tagName: string, className: string, data: TGetCars) {
    super(tagName, className);
    this.data = data;
    this.total = this.data.total || DefaultConst.carsCount;
    this.event = new EventObserver();
    this.db = new Database();
    this.isPushRace = false;
  }
  async getGeneratorCars(): Promise<HTMLElement> {
    const generator = new GeneratorCar('div', 'car-generator');
    return generator.render();
  }

  generateTitle(total: string): HTMLHeadingElement {
    const title = document.createElement('h1');
    title.classList.add('garage__title');
    const allCars = total || this.total;
    title.innerHTML = `Garage (${allCars})`;
    return title;
  }

  generatePageTitle(): HTMLHeadingElement {
    const title = document.createElement('h2');
    title.classList.add('garage__page-title');
    const currentPage = sessionStorage.getItem('currentPage') ?? DefaultConst.defaultPage;
    title.innerHTML = `Page #${currentPage}`;
    return title;
  }

  getCar(data: TGetCars): HTMLDivElement {
    const cars = document.createElement('div');
    cars.classList.add('cars');

    data.items.map(async (carData) => {
      const car = new Car('div', 'car', this.event);
      if (!carData.id) throw new Error('Car id is not defined');

      const currentCar: HTMLElement = car.renderCar(carData.name, carData.color, Number(carData.id));
      cars.append(currentCar);
      return cars;
    });
    return cars;
  }

  async generatePagination(): Promise<HTMLDivElement> {
    const pagination = document.createElement('div');
    pagination.classList.add('pagination');
    Store.addToStore('pagination', pagination);
    const paginationUl = document.createElement('ul');
    paginationUl.classList.add('pagination__list');

    await this.generatePaginationUl(paginationUl);

    pagination.append(paginationUl);
    return pagination;
  }

  async generatePaginationUl(paginationUl: HTMLUListElement): Promise<HTMLUListElement> {
    const currentPage = sessionStorage.getItem('currentPage') ?? DefaultConst.defaultPage;
    const data = await this.db.getCars(Endpoint.garage, currentPage);

    const pages = Math.ceil(Number(data.total) / 7);
    const pagesArray: (string | number)[] = getPaginationGenerator(currentPage, pages);

    pagesArray.map((pageItem) => {
      const paginationItem = document.createElement('li');
      paginationItem.classList.add('pagination__item');
      paginationItem.textContent = `${pageItem}`;
      const id = Number(paginationItem.textContent);
      paginationItem.id = `${id}`;

      this.toggleActiveClass(paginationItem, id, currentPage);
      this.togglePage(paginationItem);

      return paginationUl.append(paginationItem);
    });
    return paginationUl;
  }

  togglePage(item: HTMLLIElement): void {
    item.addEventListener('click', async () => {
      const currentPageNumber = Number(item.id);
      Store.setCurrentPage(currentPageNumber);

      const event = Store.getFromEvent('event');
      if (event === undefined) throw new Error('Event is undefined');
      sessionStorage.setItem('currentPage', JSON.stringify(currentPageNumber));
      event.notify('update');
    });
  }

  toggleActiveClass = (paginationItem: HTMLLIElement, id: number, currentPage: string): void => {
    if (id === Number(currentPage)) {
      paginationItem.classList.add('pagination__item--active');
    } else {
      paginationItem.classList.remove('pagination__item--active');
    }
    if (paginationItem.textContent === '...') {
      paginationItem.classList.add('pagination__item--disabled');
    } else {
      paginationItem.classList.remove('pagination__item--disabled');
    }
  };

  eventListener(): void {
    Store.addToEvent('event', this.event);
    this.event.subscribe(async (event) => {
      const currentPage = sessionStorage.getItem('currentPage') ?? DefaultConst.defaultPage;
      const dataCars = await this.db.getCars('garage', currentPage);
      const currentId = Store.getCurrentId();
      switch (event) {
        case 'update':
          this.rerenderCars(dataCars);
          await this.rerenderInterface();
          await this.rerenderPagination();
          this.toggleUpdateButton('disable');
          break;
        case 'updateCars':
          this.rerenderCars(dataCars);
          await this.rerenderPagination();
          break;
        case 'updateInput':
          await this.rerenderInterface();
          this.toggleUpdateButton('enable');
          break;
        case 'race':
          this.isPushRace = true;
          await this.raceAllCar(dataCars.items);
          break;
        case 'reset':
          this.isPushRace = false;
          await this.resetAllCars(dataCars.items);
          break;
        case 'start':
          await this.startDrive(currentId, await this.db.startEngine(currentId, Engine.start));
          break;
        case 'stop':
          await this.resetCarOnStartPosition(Number(this.getElement(`carState${currentId}`).id), currentId);
          break;
        default:
      }
    });
  }

  toggleEngineButton(id: string, variant: string): void {
    const carStopButton = this.getElement(`carStop${id}`);
    const carStartButton = this.getElement(`carStart${id}`);
    if (!(carStopButton instanceof HTMLButtonElement)) throw new Error('CarStopButton is not HTMLButtonElement');
    if (!(carStartButton instanceof HTMLButtonElement)) throw new Error('CarStartButton is not HTMLButtonElement');

    if (variant === 'start') {
      carStopButton.classList.remove('car__button--disabled');
      carStartButton.classList.add('car__button--disabled');
    } else {
      carStopButton.classList.add('car__button--disabled');
      carStartButton.classList.remove('car__button--disabled');
    }
  }

  toggleUpdateButton(variant: string) {
    const update = Store.getFromStore('updateInterface');
    if (!update || !(update instanceof HTMLElement)) throw new Error('Update input is not HTMLElement');
    if (variant === 'enable') {
      update.classList.remove('car-generator__wrapper--disabled');
    }
    if (variant === 'disable') {
      update.classList.add('car-generator__wrapper--disabled');
      this.clearInputsInUpdate();
    }
  }

  togglePaginationButtons(variant: string) {
    const pagination = Store.getFromStore('pagination');
    if (!pagination || !(pagination instanceof HTMLElement)) throw new Error('Pagination is not HTMLElement');
    if (variant === 'enable') {
      pagination.classList.remove('pagination--disabled');
    }
    if (variant === 'disable') {
      pagination.classList.add('pagination--disabled');
    }
  }

  toggleAllButtons(variant: string, id: string) {
    if (variant === 'enable') {
      this.toggleEngineButton(id, 'stop');
      this.togglePaginationButtons('enable');
    } else {
      this.toggleEngineButton(id, 'start');
      this.toggleUpdateButton('disable');
      this.togglePaginationButtons('disable');
    }
  }

  async raceAllCar(cars: ICar[]) {
    let isNotFinished = true;
    await Promise.all(
      cars.map(async (car) => {
        if (car.id === undefined) throw new Error('Car id is not defined');
        const carState = await this.db.startEngine(car.id, Engine.start);
        const state = await this.startDrive(car.id, carState);

        if (state?.finish && isNotFinished) {
          this.generateModal(car.name, state?.time);
          isNotFinished = false;
          const time = Number((state.time / 1000).toFixed(2));
          const curCar = await this.db.getWinner(car.id);
          if (curCar.id) {
            if (!curCar.wins) throw new Error('Car wins is not defined');
            if (!curCar.time) throw new Error('Car time is not defined');
            const winsCount = curCar.wins + 1;
            const lessesTime = curCar.time > time ? time : curCar.time;
            await this.db.updateWinner(curCar.id, { wins: winsCount, time: lessesTime });
          } else {
            await this.db.createWinner(Number(car.id), 1, time);
          }
        }
        return false;
      })
    );
    this.isPushRace = false;
    this.togglePaginationButtons('enable');
  }

  resetAllCars(cars: ICar[]): Promise<PromiseSettledResult<void>[]> {
    return Promise.allSettled(
      cars.map(async (car) => {
        if (car.id === undefined) throw new Error('Car id is not defined');
        const requestId = this.getElement(`carState${car.id}`);
        await this.resetCarOnStartPosition(Number(requestId.id), car.id);
      })
    );
  }

  generateModal(carName: string, time: number): void {
    const modal = document.createElement('div');
    modal.classList.add('modal');
    const timeSecond = Number((time / 1000).toFixed(2));
    const textContent = `${carName} winning, with ${timeSecond} seconds`;
    modal.textContent = textContent;
    document.body.append(modal);
    setTimeout(() => {
      modal.remove();
    }, 5000);
  }

  async resetCarOnStartPosition(requestId: number, id: string) {
    const carModel = this.getElement(`carModel${id}`);
    if (!(carModel instanceof HTMLElement)) throw new Error('CarModel is not HTMLDivElement');
    carModel.style.transform = 'translate(0px)';
    cancelAnimationFrame(requestId);
    await this.db.startEngine(id, Engine.stop);
    this.toggleAllButtons('enable', id);
  }

  getElement(key: string) {
    const value = Store.getFromStore(key);
    if (!value) throw new Error(`${key} is undefined`);
    return value;
  }

  async startDrive(id: string, carState: { velocity: number; distance: number }): Promise<IStateCar> {
    this.toggleAllButtons('disable', id);
    const { velocity, distance } = carState;
    const carModel = this.getElement(`carModel${id}`);
    const carFinishLine = this.getElement(`carFinishLine${id}`);
    if (!(carModel instanceof HTMLDivElement)) throw new Error('CarModel is not HTMLDivElement');
    if (!(carFinishLine instanceof HTMLImageElement)) throw new Error('CarFinishLine is not HTMLDivElement');
    const time = distance / velocity;
    const distanceWindow = this.getDistanceBetweenElements(carModel, carFinishLine);
    const res = this.animationCar(carModel, distanceWindow, time);
    Store.addToStore(`carState${id}`, res);
    await this.db.switchCarEngine(id, Engine.drive).then((response) => {
      if (response.status !== 200) {
        cancelAnimationFrame(res.id);
      }
      return response;
    });
    if (!this.isPushRace) {
      this.togglePaginationButtons('enable');
    }
    return res;
  }

  getDistanceBetweenElements = (element1: HTMLElement, element2: HTMLElement): number => {
    const rect1 = element1.getBoundingClientRect();
    const rect2 = element2.getBoundingClientRect();
    return Math.abs(rect1.left - rect2.left) + 20;
  };

  animationCar(car: HTMLElement, distance: number, animationTime: number) {
    let start: null | number = null;

    const res: IStateCar = {
      id: 0,
      time: 0,
    };
    function step(timeStep: number) {
      if (!start) start = timeStep;
      const time = timeStep - start;
      const passed = Math.round(time * (distance / animationTime));
      const currentCar = car;
      currentCar.style.transform = `translate(${Math.min(passed, distance)}px)`;
      res.distance = passed;
      if (passed < distance) {
        res.id = requestAnimationFrame(step);
      } else {
        res.finish = true;
      }
      res.time = time;
    }

    res.finish = false;
    res.id = requestAnimationFrame(step);
    return res;
  }

  rerenderCars(carsData: TGetCars) {
    const containerCar = Store.getFromStore('containerCar');
    if (!containerCar || !(containerCar instanceof HTMLDivElement)) {
      throw new Error('containerCar is not HTMLDivElement');
    }
    containerCar.innerHTML = '';
    const title = this.generateTitle(carsData.total || this.total);
    const pageTitle = this.generatePageTitle();
    const cars = this.getCar(carsData);

    containerCar.append(title, pageTitle, cars);
  }

  async rerenderInterface(): Promise<void> {
    const generatorCar = Store.getFromStore('generatorCar');
    if (!generatorCar || !(generatorCar instanceof HTMLDivElement)) {
      throw new Error('Cars container is not HTMLDivElement');
    }
    generatorCar.innerHTML = '';
    generatorCar.append(await this.getGeneratorCars());
  }

  async rerenderPagination(): Promise<void> {
    const pagination = Store.getFromStore('pagination');
    if (!pagination || !(pagination instanceof HTMLDivElement)) {
      throw new Error('Pagination container is not HTMLDivElement');
    }
    pagination.innerHTML = '';
    const paginationUl = document.createElement('ul');
    paginationUl.classList.add('pagination__list');

    await this.generatePaginationUl(paginationUl);

    pagination.append(paginationUl);
  }

  async appendAll(carsData: TGetCars, total: string) {
    const containerCar = document.createElement('div');
    containerCar.classList.add('garage');

    const generatorCar = document.createElement('div');
    generatorCar.classList.add('car-generator');

    const title = this.generateTitle(total);
    const pageTitle = this.generatePageTitle();
    const cars = this.getCar(carsData);

    containerCar.append(title, pageTitle, cars);
    generatorCar.append(await this.getGeneratorCars());

    this.container.append(generatorCar, containerCar, await this.generatePagination());
    return {
      generatorCar,
      containerCar,
    };
  }

  clearInputsInUpdate() {
    const title = Store.getFromStore('updateTitle');
    const color = Store.getFromStore('updateColor');

    if (!title || !(title instanceof HTMLInputElement)) throw new Error('Title input is not HTMLInputElement');
    if (!color || !(color instanceof HTMLInputElement)) throw new Error('Color input is not HTMLInputElement');

    title.value = '';
    color.value = '#000000';
  }

  async renderGarage(): Promise<HTMLElement> {
    this.eventListener();
    const data = await this.appendAll(this.data, this.total);
    const { containerCar, generatorCar } = data;
    Store.addToStore('containerCar', containerCar);
    Store.addToStore('generatorCar', generatorCar);
    this.toggleUpdateButton('disable');
    return this.container;
  }
}

export default Garage;
