import { ICar } from '@core/ts/interfaces';
import Component from '@core/templates/component';
import EventObserver from '@core/eventObserver';
import Database from '@db/index';
import Store from '@core/store';
import finish from '@assets/images/finish-flag.png';
import getCarImage from '@helpers/getCarImage';
import { Event } from '@core/ts/enum';

class Car extends Component {
  event: EventObserver<unknown>;
  db: Database;

  constructor(tagName: string, className: string, event: EventObserver<unknown>) {
    super(tagName, className);
    this.event = event;
    this.db = new Database();
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
    const event = Store.getFromEvent('event');
    if (!event) throw new Error('Event is undefined');
    const car: ICar = await this.db.getCar(id);
    if (!car) throw new Error('Car1 is undefined');
    switch (variant) {
      case Event.delete:
        await this.db.deleteCar(id);
        await this.db.deleteWinner(id);
        event.notify(Event.update);
        break;
      case Event.select: {
        Store.addToStore('car', car);
        event.notify(Event.select);
        break;
      }
      case Event.start: {
        Store.setCurrentId(id);
        Store.addToStore('car', car);
        event.notify(Event.start);
        break;
      }
      case Event.stop: {
        event.notify(Event.stop);
        break;
      }
      default:
    }
  }

  getElement(key: string) {
    const value = Store.getFromStore(key);
    if (!value) throw new Error(`${key} is undefined`);
    return value;
  }

  enableListenersOnButton(button: HTMLButtonElement, id: string, variant: string): void {
    button.addEventListener('click', async () => {
      await this.callbackEvent(id, variant);
    });
  }

  generateCar(color: string, id: number): HTMLDivElement {
    const container = document.createElement('div');
    container.classList.add('car__container');

    const buttonContainer = document.createElement('div');
    buttonContainer.classList.add('car__button-container');

    const carStart = this.generateButton('Start', 'car__button--start');
    const carStop = this.generateButton('Stop', 'car__button--stop');
    carStop.classList.add('car__button--disabled');
    Store.addToStore(`carStop${id}`, carStop);
    Store.addToStore(`carStart${id}`, carStart);

    this.enableListenersOnButton(carStart, id.toString(), 'start');
    this.enableListenersOnButton(carStop, id.toString(), 'stop');

    const carWrapper = document.createElement('div');
    carWrapper.classList.add('car__wrapper');
    const imgSvg = getCarImage(color);

    const car = document.createElement('div');
    car.classList.add('car__model');
    car.innerHTML = imgSvg;

    const finishLine = document.createElement('img');
    finishLine.classList.add('car__finish-line');
    finishLine.src = finish;

    Store.addToStore(`carModel${id}`, car);
    Store.addToStore(`carFinishLine${id}`, finishLine);
    buttonContainer.append(carStart, carStop);
    carWrapper.append(car, finishLine);
    container.append(buttonContainer, carWrapper);
    return container;
  }

  renderCar(name: string, color: string, id: number): HTMLElement {
    const carControls = this.generateCarControls(name, id);
    const car = this.generateCar(color, id);
    this.container.append(carControls, car);
    return this.container;
  }
}

export default Car;
