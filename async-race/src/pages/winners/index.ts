import Database from '@db/index';
import Winners from '@core/components/winners';
import Page from '@core/templates/page';
import { DefaultConst, Pagination, Sort } from '@core/ts/enum';

class WinnersPage extends Page {
  async getWinners(): Promise<HTMLElement> {
    const db = new Database();
    const currentPage = sessionStorage.getItem(`${Pagination.winners}currentPage`) ?? DefaultConst.defaultPage;
    const sort = sessionStorage.getItem('sort') ?? '';
    const orderWins = sessionStorage.getItem('orderWins') ?? Sort.DESC;
    const orderTime = sessionStorage.getItem('orderTime') ?? Sort.DESC;
    if (!sort) throw new Error('Sort is undefined');
    const order = sort === 'wins' ? orderWins : orderTime;
    const data = await db.getWinners(currentPage, sort, order);
    const winners = new Winners('div', 'winners', data);
    const result = await winners.renderWinners();
    return result;
  }
  async render(): Promise<HTMLElement> {
    this.container.append(await this.getWinners());
    return this.container;
  }
}

export default WinnersPage;
