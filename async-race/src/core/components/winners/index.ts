import { ICar } from '@core/ts/interfaces';
import Database from '@db/index';
import Component from '@core/templates/component';
import getCarImage from '@helpers/getCarImage';

class Winners extends Component {
  db: Database;
  constructor(tagName: string, className: string) {
    super(tagName, className);
    this.db = new Database();
  }

  async generateTitle(): Promise<HTMLHeadingElement> {
    const title = document.createElement('h1');
    title.classList.add('winners__title');
    const data = await this.db.getWinners(1);
    title.textContent = `Winners (${data.total})`;

    return title;
  }

  generatePageTitle(): HTMLHeadingElement {
    const title = document.createElement('h3');
    title.classList.add('winners__page');
    title.textContent = `Page #${1}`;

    return title;
  }

  async generateCarsWinner(): Promise<HTMLDivElement> {
    const carsContainer = document.createElement('div');
    carsContainer.classList.add('winners__cars-container');
    const navigation = this.generateContent('navigation');

    const carsWinners = await this.db.getWinners(1);
    carsWinners.items.map(async (car, index) => {
      const { id, wins, time } = car;
      if (!id) throw new Error('Id is undefined');
      const car1 = await this.db.getCar(id);
      const { name, color } = car1;
      const carInfo = { name, color, id, wins, time };
      const carHTML = this.generateContent('car', carInfo, index + 1);
      carsContainer.append(carHTML);
    });
    carsContainer.append(navigation);
    this.container.append(carsContainer);
    return carsContainer;
  }

  generateContent(value: string, car?: ICar | undefined, index: number = 1): HTMLUListElement {
    const element = document.createElement('ul');
    element.classList.add(`winners__${value}`);
    const number = document.createElement('li');
    number.classList.add(`winners__${value}-item`);
    const carModel = document.createElement('li');
    carModel.classList.add(`winners__${value}-item`);
    const carName = document.createElement('li');
    carName.classList.add(`winners__${value}-item`);
    const carWins = document.createElement('li');
    carWins.classList.add(`winners__${value}-item`);
    const carBestTime = document.createElement('li');
    carBestTime.classList.add(`winners__${value}-item`);
    if (!car) {
      number.textContent = 'number';
      carModel.textContent = 'car';
      carName.textContent = 'name';
      carWins.textContent = 'wins';
      carBestTime.textContent = 'best time';
    } else {
      if (!car.id || !car.wins || !car.time) throw new Error('Id is undefined');
      carModel.innerHTML = getCarImage(car.color);
      number.textContent = `${index}`;
      carName.textContent = car.name;
      carWins.textContent = `${car.wins}`;
      carBestTime.textContent = `${car.time}`;
    }
    element.append(number, carModel, carName, carWins, carBestTime);
    return element;
  }

  async appendAll(): Promise<HTMLElement> {
    const titlePage = await this.generateTitle();
    const titleCurrentPageNumber = this.generatePageTitle();
    this.container.append(titlePage, titleCurrentPageNumber);
    return this.container;
  }

  async renderWinners(): Promise<HTMLElement> {
    await this.appendAll();
    await this.generateCarsWinner();
    return this.container;
  }
}

export default Winners;
