import Page from '@core/templates/page';
import Database from '@db/index';
import { Garage } from '@core/components';
import { Endpoint } from '@core/ts/enum';

class GaragePage extends Page {
  async getCars(): Promise<HTMLElement> {
    const db = new Database();
    const currentPage = sessionStorage.getItem('currentPage') ?? '1';
    const data = await db.getCars(Endpoint.garage, currentPage);
    const cars = new Garage('div', 'garage__wrapper', data);
    const result = await cars.renderGarage();
    return result;
  }

  async render(): Promise<HTMLElement> {
    this.container.append(await this.getCars());
    return this.container;
  }
}

export default GaragePage;
