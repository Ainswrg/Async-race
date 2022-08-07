import { TGetCars } from '@core/ts/types';
import Database from '@db/index';
import getPaginationGenerator from '@helpers/paginate';
import { DefaultConst, Endpoint, Event, Pagination } from '@core/ts/enum';
import Store from '@core/store';

class Component {
  protected container: HTMLElement;

  constructor(tagName: string, className: string) {
    this.container = document.createElement(tagName);
    this.container.className = className;
  }
  appendContent(content: HTMLElement) {
    this.container.append(content);
  }
  appendText(text: string) {
    this.container.innerText = text;
  }
  async generatePagination(name: string, maxPage: number = 7): Promise<HTMLDivElement> {
    const pagination = document.createElement('div');
    pagination.classList.add('pagination');
    Store.addToStore(name, pagination);
    const paginationUl = document.createElement('ul');
    paginationUl.classList.add('pagination__list');

    await this.generatePaginationUl(paginationUl, name, maxPage);

    pagination.append(paginationUl);
    return pagination;
  }
  async generatePaginationUl(
    paginationUl: HTMLUListElement,
    name: string,
    maxPage: number = 7
  ): Promise<HTMLUListElement> {
    const currentPage = sessionStorage.getItem(`${name}currentPage`) ?? DefaultConst.defaultPage;
    const db = new Database();
    let data: TGetCars | null = null;
    if (maxPage === 7) {
      data = await db.getCars(Endpoint.garage, currentPage);
    } else {
      data = await db.getWinners(currentPage);
    }
    if (!data) throw new Error('Data is undefined');
    const pages = Math.ceil(Number(data.total) / maxPage);
    const pagesArray: (string | number)[] = getPaginationGenerator(currentPage, pages);

    pagesArray.map((pageItem) => {
      const paginationItem = document.createElement('li');
      paginationItem.classList.add('pagination__item');
      paginationItem.textContent = `${pageItem}`;
      const id = Number(paginationItem.textContent);
      paginationItem.id = `${id}`;

      this.toggleActiveClass(paginationItem, id, currentPage);
      this.togglePage(paginationItem, name);

      return paginationUl.append(paginationItem);
    });
    return paginationUl;
  }
  togglePage(item: HTMLLIElement, name: string): void {
    item.addEventListener('click', async () => {
      const currentPageNumber = Number(item.id);

      const event = name === Pagination.winners ? Store.getFromEvent('eventWinners') : Store.getFromEvent('event');
      if (event === undefined) throw new Error('Event is undefined');
      sessionStorage.setItem(`${name}currentPage`, JSON.stringify(currentPageNumber));
      event.notify(Event.update);
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
  render() {
    return this.container;
  }
}

export default Component;
