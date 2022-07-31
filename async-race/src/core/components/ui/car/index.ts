import { ICar } from '@core/ts/interfaces';
import Component from '@core/templates/component';
import EventObserver from '@core/eventObserver';
import Database from '@db/index';
import Store from '@core/store';
import finish from '@assets/images/finish-flag.png';

class Car extends Component {
  event: EventObserver<unknown>;

  constructor(tagName: string, className: string, event: EventObserver<unknown>) {
    super(tagName, className);
    this.event = event;
  }
  generateButton(name: string, className: string): HTMLButtonElement {
    const button = document.createElement('button');
    button.classList.add(className);
    button.innerHTML = name;

    return button;
  }
  generateCarControls(name: string, id: number): HTMLDivElement {
    const container = document.createElement('div');
    container.classList.add('car__controls');
    this.container.id = id.toString();

    const select = this.generateButton('Select', 'car__button--select');
    const remove = this.generateButton('Remove', 'car__button--remove');
    const carTitle = document.createElement('h4');

    carTitle.classList.add('car__title');
    carTitle.textContent = name;
    container.append(select, remove, carTitle);

    this.enableListenersOnButton(remove, id.toString(), 'delete');
    this.enableListenersOnButton(select, id.toString(), 'select');
    return container;
  }

  async callbackEvent(id: string, variant: string): Promise<void> {
    const event = Store.event.get('event');
    if (!event) throw new Error('Event is undefined');
    const db = new Database();

    if (variant === 'delete') {
      await db.deleteCar(id);
      event.notify('updateCars');
    }

    if (variant === 'select') {
      const car: ICar = await db.getCar(id);
      if (!car) throw new Error('Car1 is undefined');
      Store.addToStore('car', car);
      event.notify('updateInput');
    }
  }

  enableListenersOnButton(button: HTMLButtonElement, id: string, variant: string): void {
    button.addEventListener('click', async () => {
      await this.callbackEvent(id, variant);
    });
  }

  getCarImage(color: string) {
    const img = `<svg fill="${color}"xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#" xmlns="http://www.w3.org/2000/svg" xmlns:cc="http://creativecommons.org/ns#" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:svg="http://www.w3.org/2000/svg" id="svg2" viewBox="0 0 167.83 55.332" version="1.0">
    <g id="layer1" transform="translate(-227.51 -167.55)">
      <path id="path2220" fill-rule="evenodd" d="m229.52 196.33c-0.09-8.41 0.63-14.12 2.92-14.62l11.85-1.54c8.38-3.87 17.11-8.68 24.77-10.62 5.88-1.17 12.1-1.88 18.77-2 13.43 0.22 28.36-0.7 37.85 2.47 9.04 4.17 17.95 8.62 26.46 13.84 11.48 0.79 34.91 3.98 38.32 7.7 1.69 2.28 3.05 4.73 3.69 7.54 1.49 0.61 1.38 2.82 0.77 5.53l-0.16 5.54-5.69 2.31-11.23 1.39-2.92 0.77c-4.24 9.94-19.98 8.71-24.31-0.47l-3.54 0.62-63.09-0.62-0.77 1.08-4.92-0.15c-3.3 10.15-22.17 11.08-25.08-1.39h-2.46l-7.39-1.07-11.23-1.54c-3.06-1.82-4.34-3.19-4.62-4.31l0.77-1.08-0.61-6.15c0.41-2.09 0.79-2.76 1.85-3.23zm68.16-26.37c-6.77 0.01-13.39 0.26-19.34 1.57l1.39 11.78 20.9 0.72c0.86-0.18 1.76-0.32 1.59-1.79l-2.18-12.28c-0.79-0.01-1.57 0-2.36 0zm-20.34 1.8c-4.01 0.97-7.7 2.47-10.9 4.74-1.27 0.85-1.73 1.85-1.68 2.97 0.59 2.54 2.09 3.57 4.26 3.47l9.71 0.33-1.39-11.51zm27.26-1.7l4.46 12.68c0.56 0.92 1.38 1.61 2.88 1.69l21.7 0.89c-3.09-2.11-0.55-6 2.58-5.15-5.87-4.89-12.24-7.99-19.13-9.22-4.05-0.65-8.26-0.79-12.49-0.89zm-71.88 12.58c-1.78 0.64-2.21 5.18-2.29 10.75l5.83-0.05c0.22-1.95 0.26-3.9 0.02-5.85-0.57-3.41-2.17-3.83-3.56-4.85zm38.65 5.22h5.51c0.43 0 0.79 0.36 0.79 0.79 0 0.44-0.36 0.79-0.79 0.79h-5.51c-0.44 0-0.79-0.35-0.79-0.79 0-0.43 0.35-0.79 0.79-0.79zm38 0.91h5.51c0.44 0 0.79 0.35 0.79 0.79s-0.35 0.79-0.79 0.79h-5.51c-0.44 0-0.79-0.35-0.79-0.79s0.35-0.79 0.79-0.79zm-34.25 21.22c0 5.04-4.09 9.13-9.13 9.13s-9.13-4.09-9.13-9.13 4.09-9.13 9.13-9.13 9.13 4.09 9.13 9.13zm97.44-1.16c0 5.04-4.09 9.13-9.13 9.13s-9.13-4.09-9.13-9.13 4.09-9.13 9.13-9.13 9.13 4.09 9.13 9.13zm7.63-11.03l11.79 0.08c-0.91-1.96-2.08-3.7-3.91-5.12l-4.56 0.35c-0.84 0.13-1.19 0.5-1.5 0.89l-1.82 3.8z"/>
    </g>
    </svg>`;

    return img;
  }

  generateCar(color: string): HTMLDivElement {
    const container = document.createElement('div');
    container.classList.add('car__container');

    const buttonContainer = document.createElement('div');
    buttonContainer.classList.add('car__button-container');

    const carStart = this.generateButton('Start', 'car__button--start');
    const carStop = this.generateButton('Stop', 'car__button--stop');

    const carWrapper = document.createElement('div');
    carWrapper.classList.add('car__wrapper');

    const imgSvg = this.getCarImage(color);

    const car = document.createElement('span');
    car.classList.add('car__model');
    car.innerHTML = imgSvg;

    const finishLine = document.createElement('img');
    finishLine.classList.add('car__finish-line');
    finishLine.src = finish;

    buttonContainer.append(carStart, carStop);
    carWrapper.append(car, finishLine);
    container.append(buttonContainer, carWrapper);
    return container;
  }

  renderCar(name: string, color: string, id: number): HTMLElement {
    const carControls = this.generateCarControls(name, id);
    const car = this.generateCar(color);
    this.container.append(carControls, car);
    return this.container;
  }
}

export default Car;
