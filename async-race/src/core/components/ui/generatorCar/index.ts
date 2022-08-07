import { Endpoint, DefaultConst, Pagination, Event } from '@core/ts/enum';
import { ICar } from '@core/ts/interfaces';
import Component from '@core/templates/component';
import Database from '@db/index';
import Store from '@core/store';
import CarRandomGenerate from '@helpers/generateRandomCars';

class GeneratorCar extends Component {
  protected static cars: HTMLElement[] = [];

  generateGeneratorCars(name: string) {
    const divInput = document.createElement('div');
    const inputForTitle = document.createElement('input');
    const inputForColor = document.createElement('input');
    const button = document.createElement('button');

    divInput.classList.add('car-generator__wrapper');

    inputForTitle.classList.add('car-generator__title');
    inputForTitle.setAttribute('type', 'text');
    inputForTitle.setAttribute('placeholder', 'Title');

    inputForColor.classList.add('car-generator__color');
    inputForColor.setAttribute('type', 'color');

    button.classList.add('car-generator__input-button');
    button.innerHTML = name;

    divInput.append(inputForTitle, inputForColor, button);
    return {
      divInput,
      inputForTitle,
      inputForColor,
      button,
    };
  }

  async getCreateInterface(): Promise<HTMLElement> {
    const create = this.generateGeneratorCars('create');
    const db = new Database();

    const event = Store.getFromEvent('event');
    if (event === undefined) throw new Error('Event is undefined');

    create.button.addEventListener('click', async () => {
      await db.createCar(create.inputForTitle.value, create.inputForColor.value);
      event.notify(Event.update);
    });
    return create.divInput;
  }

  async getUpdateInterface(): Promise<HTMLElement> {
    const update = this.generateGeneratorCars('update');

    Store.addToStore('updateInterface', update.divInput);
    Store.addToStore('updateTitle', update.inputForTitle);
    Store.addToStore('updateColor', update.inputForColor);
    const db = new Database();

    const event = Store.getFromEvent('event');
    if (event === undefined) throw new Error('Event is undefined');

    const carBefore = Store.getFromStore('car');

    const id = carBefore?.id || DefaultConst.defaultPage;

    update.button.addEventListener('click', async () => {
      await db.updateCar(update.inputForTitle.value, update.inputForColor.value, id.toString());
      event.notify(Event.update);
    });
    const currentPage = sessionStorage.getItem(`${Pagination.garage}currentPage`) ?? DefaultConst.defaultPage;
    const cars = await db.getCars(Endpoint.garage, currentPage);
    cars.items.forEach((car) => {
      if (car.id === id) {
        update.inputForTitle.value = car?.name || '';
        update.inputForColor.value = car?.color || '#000000';

        Store.addToStore('car', car);
      }
    });

    return update.divInput;
  }

  generateButton(name: string): HTMLButtonElement {
    const button = document.createElement('button');
    button.classList.add('car-generator__button');
    button.innerHTML = name;
    return button;
  }

  async generateButtons(): Promise<HTMLElement> {
    const wrapper = document.createElement('div');
    wrapper.classList.add('car-generator__buttons');

    const race = await this.enableListenerButton('race');
    const reset = await this.enableListenerButton('reset');
    const generateCars = this.generateButton('generate cars');
    this.generateRandomCars(generateCars);
    wrapper.append(race, reset, generateCars);
    return wrapper;
  }

  async generateRandomCars(button: HTMLButtonElement): Promise<void> {
    const db = new Database();
    const event = Store.getFromEvent('event');
    if (!event) throw new Error('Event is undefined');
    const oneHundredCars: ICar[] = new CarRandomGenerate().generateOneHundredCars();

    button.addEventListener('click', async () => {
      Promise.all(
        oneHundredCars.map(async (car) => {
          await db.createCar(car.name, car.color);
        })
      )
        .then(() => event.notify(Event.updateCars))
        .catch((error) => error);
    });
  }

  async enableListenerButton(name: string) {
    const element = this.generateButton(name);

    element.addEventListener('click', async () => {
      const event = Store.getFromEvent('event');
      if (!event) throw new Error('Event is undefined');
      event.notify(name);
    });

    return element;
  }

  async appendAll() {
    const create = await this.getCreateInterface();
    const update = await this.getUpdateInterface();
    const buttons = await this.generateButtons();
    this.container.append(create, update, buttons);
  }

  render() {
    this.appendAll();
    return this.container;
  }
}

export default GeneratorCar;
