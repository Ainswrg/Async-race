import { DefaultConst, Event, Pagination, Sort } from '@core/ts/enum';
import { ICar } from '@core/ts/interfaces';
import Database from '@db/index';
import Component from '@core/templates/component';
import getCarImage from '@helpers/getCarImage';
import Store from '@core/store';
import EventObserver from '@core/eventObserver';
import { TGetCars } from '@core/ts/types';

class Winners extends Component {
  db: Database;
  event: EventObserver<unknown>;
  data: TGetCars;

  constructor(tagName: string, className: string, data: TGetCars) {
    super(tagName, className);
    this.db = new Database();
    this.event = new EventObserver();
    this.data = data;
  }

  async generateTitle(): Promise<HTMLHeadingElement> {
    const title = document.createElement('h1');
    title.classList.add('winners__title');
    const data = await this.db.getWinners(DefaultConst.defaultPage);
    title.textContent = `Winners (${data.total})`;

    return title;
  }

  generatePageTitle(): HTMLHeadingElement {
    const currentPage = sessionStorage.getItem(`${Pagination.winners}currentPage`) ?? DefaultConst.defaultPage;
    const title = document.createElement('h3');
    title.classList.add('winners__page');
    title.textContent = `Page #${currentPage}`;

    return title;
  }

  async generateCarsWinner(cars: TGetCars): Promise<HTMLDivElement> {
    const carsContainer = document.createElement('div');
    carsContainer.classList.add('winners__cars-container');
    const navigation = this.generateContent('navigation');

    cars.items.map(async (car, index) => {
      const currentPage = sessionStorage.getItem(`${Pagination.winners}currentPage`) ?? DefaultConst.defaultPage;
      let number = index + 1;
      if (Number(currentPage) > 1) {
        number += Number(currentPage) * 10 - 10;
      }

      const { id, wins, time } = car;
      if (!id) throw new Error('Id is undefined');
      const car1 = await this.db.getCar(id);
      const { name, color } = car1;
      const carInfo = { name, color, id, wins, time };
      const carHTML = this.generateContent('car', carInfo, number);
      carsContainer.append(carHTML);
    });
    carsContainer.append(navigation);
    this.container.append(carsContainer);
    return carsContainer;
  }

  generateContent(value: string, car?: ICar | undefined, index: number = 1): HTMLUListElement {
    const element = this.generateElement('ul', value);
    if (!(element instanceof HTMLUListElement)) throw new Error('Element is not HTMLUListElement');
    const number = this.generateElement('li', value);
    const carModel = this.generateElement('li', value);
    const carName = this.generateElement('li', value);
    const carWins = this.generateElement('li', value);
    const carBestTime = this.generateElement('li', value);
    if (!car) {
      if (sessionStorage.getItem('orderWins') === Sort.DESC) {
        carWins.classList.add('desc');
        carWins.classList.remove('asc');
      } else {
        carWins.classList.remove('desc');
        carWins.classList.add('asc');
      }
      if (sessionStorage.getItem('orderTime') === Sort.DESC) {
        carBestTime.classList.add('desc');
        carBestTime.classList.remove('asc');
      } else {
        carBestTime.classList.remove('desc');
        carBestTime.classList.add('asc');
      }
      this.enableListenersOnButton(carWins, 'wins');
      this.enableListenersOnButton(carBestTime, 'bestTime');
      this.fillItems(number, carModel, carName, carWins, carBestTime);
    } else {
      if (!car.id || !car.wins || !car.time) throw new Error('Id | wins | time is undefined');
      carModel.innerHTML = getCarImage(car.color);
      number.textContent = `${index}`;
      carName.textContent = car.name;
      carWins.textContent = `${car.wins}`;
      carBestTime.textContent = `${car.time}`;
    }
    element.append(number, carModel, carName, carWins, carBestTime);
    return element;
  }

  fillItems(
    number: HTMLLIElement | HTMLUListElement,
    carModel: HTMLLIElement | HTMLUListElement,
    carName: HTMLLIElement | HTMLUListElement,
    carWins: HTMLLIElement | HTMLUListElement,
    carBestTime: HTMLLIElement | HTMLUListElement
  ): void {
    const [num, model, name, wins, time] = [number, carModel, carName, carWins, carBestTime];
    const [carWinsUp, carWinsDown] = this.generateUpDownNavigation();
    const [carBestTimeUp, carBestTimeDown] = this.generateUpDownNavigation();
    num.textContent = 'number';
    model.textContent = 'car';
    name.textContent = 'name';
    wins.textContent = 'wins';
    time.textContent = 'best time';
    wins.classList.add('winners__navigation-item-toggle');
    wins.append(carWinsUp, carWinsDown);
    time.textContent = `best time`;
    time.classList.add('winners__navigation-item-toggle');
    time.append(carBestTimeUp, carBestTimeDown);
  }

  enableListenersOnButton(btn: HTMLLIElement | HTMLDListElement, variant: string): void {
    btn.addEventListener('click', () => {
      Store.addToStore('currentBtn', btn);
      if (variant === 'wins') {
        const order = sessionStorage.getItem('orderWins') ?? Sort.DESC;
        sessionStorage.setItem('sort', 'wins');
        if (order === Sort.DESC) {
          sessionStorage.setItem('orderWins', Sort.ASC);
        } else {
          sessionStorage.setItem('orderWins', Sort.DESC);
        }
      }
      if (variant === 'bestTime') {
        const order = sessionStorage.getItem('orderTime') ?? Sort.DESC;
        sessionStorage.setItem('sort', 'time');
        if (order === Sort.DESC) {
          sessionStorage.setItem('orderTime', Sort.ASC);
        } else {
          sessionStorage.setItem('orderTime', Sort.DESC);
        }
      }
      this.event.notify(Event.update);
    });
  }

  generateElement(tag: string, value: string): HTMLUListElement | HTMLLIElement {
    if (tag === 'ul') {
      const element: HTMLUListElement | HTMLLIElement = document.createElement(tag);
      element.classList.add(`winners__${value}`);
      return element;
    }
    const element: HTMLLIElement = document.createElement('li');
    element.classList.add(`winners__${value}-item`);
    return element;
  }

  generateUpDownNavigation(): [up: HTMLSpanElement, down: HTMLSpanElement] {
    const up = document.createElement('span');
    up.classList.add('winners__navigation-item-up');
    up.textContent = '↑';
    const down = document.createElement('span');
    down.classList.add('winners__navigation-item-down');
    down.textContent = '↓';

    return [up, down];
  }

  eventListener(): void {
    Store.addToEvent('eventWinners', this.event);
    this.event.subscribe(async (event) => {
      const currentPage = sessionStorage.getItem(`${Pagination.winners}currentPage`) ?? DefaultConst.defaultPage;
      const sort = sessionStorage.getItem('sort') ?? '';
      const orderWins = sessionStorage.getItem('orderWins') ?? Sort.DESC;
      const orderTime = sessionStorage.getItem('orderTime') ?? Sort.DESC;
      if (!sort) throw new Error('Sort is undefined');
      const order = sort === 'wins' ? orderWins : orderTime;
      const dataCars = await this.db.getWinners(currentPage, sort, order);
      switch (event) {
        case Event.update:
          this.rerenderWinners(dataCars);
          break;
        default:
      }
    });
  }

  async appendAll(): Promise<HTMLElement> {
    const titlePage = await this.generateTitle();
    const titleCurrentPageNumber = this.generatePageTitle();
    this.container.append(titlePage, titleCurrentPageNumber);
    return this.container;
  }

  async rerenderWinners(data: TGetCars): Promise<HTMLElement> {
    this.container.innerHTML = '';
    await this.appendAll();
    await this.generateCarsWinner(data);
    this.container.append(await this.generatePagination(Pagination.winners, 10));
    return this.container;
  }
  async renderWinners(): Promise<HTMLElement> {
    this.eventListener();
    await this.appendAll();
    await this.generateCarsWinner(this.data);
    this.container.append(await this.generatePagination(Pagination.winners, 10));
    return this.container;
  }
}

export default Winners;
