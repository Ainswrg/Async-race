import { Endpoint } from '@core/ts/enum';
import Component from '@core/templates/component';
import { Car, GeneratorCar } from '@core/components';
import { TGetCars } from '@core/ts/types';
import EventObserver from '@core/eventObserver';
import Store from '@core/store';
import Database from '@db/index';
import getPaginationGenerator from '@helpers/paginate';

class Garage extends Component {
  data: TGetCars;
  event: EventObserver<unknown>;
  total: string;
  db: Database;

  constructor(tagName: string, className: string, data: TGetCars) {
    super(tagName, className);
    this.data = data;
    this.total = this.data.total || '4';
    this.event = new EventObserver();
    this.db = new Database();
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
    const currentPage = sessionStorage.getItem('currentPage') ?? '1';
    title.innerHTML = `Page #${currentPage}`;
    return title;
  }

  async getCar(data: TGetCars): Promise<HTMLDivElement> {
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

    const currentPage = sessionStorage.getItem('currentPage') ?? '1';
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

    pagination.append(paginationUl);
    return pagination;
  }

  async rerenderPagination(): Promise<void> {
    const pagination = Store.getFromStore('pagination');
    if (!pagination || !(pagination instanceof HTMLDivElement)) {
      throw new Error('Pagination container is not HTMLDivElement');
    }
    pagination.innerHTML = '';
    const paginationUl = document.createElement('ul');
    paginationUl.classList.add('pagination__list');

    const currentPage = sessionStorage.getItem('currentPage') ?? '1';
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

    pagination.append(paginationUl);
  }

  togglePage(item: HTMLLIElement): void {
    item.addEventListener('click', async () => {
      const currentPageNumber = Number(item.id);
      Store.setCurrentPage(currentPageNumber);

      const event = Store.event.get('event');
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

  eventListener() {
    Store.addToEvent('event', this.event);
    this.event.subscribe(async (event) => {
      const currentPage = sessionStorage.getItem('currentPage') ?? '1';
      const dataCars = await this.db.getCars('garage', currentPage);
      if (event === 'update') {
        await this.rerenderCars(dataCars);
        await this.rerenderInterface();
        await this.rerenderPagination();
      }
      if (event === 'updateCars') {
        await this.rerenderCars(dataCars);
      }
      if (event === 'updateInput') {
        await this.rerenderInterface();
      }
    });
  }

  async rerenderCars(carsData: TGetCars) {
    const containerCar = Store.getFromStore('containerCar');
    if (!containerCar || !(containerCar instanceof HTMLDivElement)) {
      throw new Error('containerCar is not HTMLDivElement');
    }
    containerCar.innerHTML = '';
    const title = this.generateTitle(carsData.total || this.total);
    const pageTitle = this.generatePageTitle();
    const cars = await this.getCar(carsData);

    containerCar.append(title, pageTitle, cars);
  }

  async rerenderInterface() {
    const generatorCar = Store.getFromStore('generatorCar');
    if (!generatorCar || !(generatorCar instanceof HTMLDivElement)) {
      throw new Error('Cars container is not HTMLDivElement');
    }
    generatorCar.innerHTML = '';

    generatorCar.append(this.getGeneratorCars());
  }

  async appendAll(carsData: TGetCars, total: string) {
    const containerCar = document.createElement('div');
    containerCar.classList.add('garage');

    const generatorCar = document.createElement('div');
    generatorCar.classList.add('car-generator');

    const title = this.generateTitle(total);
    const pageTitle = this.generatePageTitle();
    const cars = await this.getCar(carsData);

    containerCar.append(title, pageTitle, cars);

    generatorCar.append(this.getGeneratorCars());

    this.container.append(generatorCar, containerCar, await this.generatePagination());
    return {
      generatorCar,
      containerCar,
    };
  }

  async renderGarage(): Promise<HTMLElement> {
    this.eventListener();
    const data = await this.appendAll(this.data, this.total);
    const { containerCar, generatorCar } = data;

    Store.addToStore('containerCar', containerCar);
    Store.addToStore('generatorCar', generatorCar);
    return this.container;
  }
}

export default Garage;
