import Component from '@core/templates/component';
import Database from '@db/index';
import Store from '@core/store';

class GeneratorCar extends Component {
  protected static cars: HTMLElement[] = [];

  generateGeneratorCars(
    name: string,
    cb: (
      button: HTMLButtonElement,
      title: HTMLInputElement,
      color: HTMLInputElement,
      method: (name: string, color: string) => Promise<void>
    ) => void,
    method: (name: string, color: string) => Promise<void>
  ): HTMLDivElement {
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

    cb(button, inputForTitle, inputForColor, method);
    button.classList.add('car-generator__input-button');
    button.innerHTML = name;

    divInput.append(inputForTitle, inputForColor, button);
    return divInput;
  }

  enableListenersOnButton(
    button: HTMLButtonElement,
    title: HTMLInputElement,
    color: HTMLInputElement,
    method: (name: string, color: string) => Promise<void>
  ): void {
    const event = Store.store.get('event');
    if (event === undefined) {
      throw new Error('Event is undefined');
    }
    button.addEventListener('click', () => {
      (async () => {
        await method(title.value, color.value);
        event.notify('update');
      })();
    });
  }

  generateButton(name: string): HTMLButtonElement {
    const button = document.createElement('button');
    button.classList.add('car-generator__button');
    button.innerHTML = name;
    return button;
  }

  generateButtons(): HTMLElement {
    const wrapper = document.createElement('div');
    wrapper.classList.add('car-generator__buttons');

    const race = this.generateButton('race');
    const reset = this.generateButton('reset');
    const generateCars = this.generateButton('generate cars');

    wrapper.append(race, reset, generateCars);
    return wrapper;
  }

  appendAll() {
    const db = new Database();
    const create = this.generateGeneratorCars('create', this.enableListenersOnButton, db.createCar);
    const update = this.generateGeneratorCars('update', this.enableListenersOnButton, db.createCar);
    const buttons = this.generateButtons();
    this.container.append(create, update, buttons);
  }

  render() {
    this.appendAll();
    return this.container;
  }
}

export default GeneratorCar;
