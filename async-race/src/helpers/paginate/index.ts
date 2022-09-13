import { IPaginationGenerator } from '@core/ts/interfaces';

type TRange = {
  start: number;
  end: number;
};

class PaginationGenerator implements IPaginationGenerator {
  currentPageNumber: number;
  pageCount: number;
  showPages: number = 5;
  MINIMUM_PAGE_SIZE: number = 7;
  delta: number;
  currentPage: number;
  pagesShown: number;
  centerPagesShown: number;
  boundaryPagesShown: number;

  constructor(currentPageNumber: number, pageCount: number, showPages: number = 5, MINIMUM_PAGE_SIZE: number = 7) {
    this.currentPageNumber = currentPageNumber;
    this.pageCount = pageCount;
    this.showPages = showPages;
    this.MINIMUM_PAGE_SIZE = MINIMUM_PAGE_SIZE;
    this.delta = 0;
    this.currentPage = this.clamp(currentPageNumber, 1, pageCount);
    this.pagesShown = this.clamp(showPages, this.MINIMUM_PAGE_SIZE, pageCount);
    this.centerPagesShown = this.pagesShown - 5;
    this.boundaryPagesShown = this.pagesShown - 3;
  }
  getRange = (start: number, end: number): number[] => {
    const length = end - start + 1;
    return Array.from({ length }, (_, i) => start + i);
  };
  clamp = (number: number, lower: number, upper: number): number => {
    return Math.min(Math.max(number, lower), upper);
  };
  generate = (): Array<string | number> => {
    if (this.pageCount <= this.pagesShown) {
      this.delta = this.pagesShown;
    } else {
      this.delta =
        this.currentPage < this.boundaryPagesShown || this.currentPage > this.pageCount - this.boundaryPagesShown
          ? this.boundaryPagesShown
          : this.centerPagesShown;
    }
    const range: TRange = { start: 0, end: 0 };
    range.start = Math.round(this.currentPage - this.delta / 2);
    range.end = Math.round(this.currentPage + this.delta / 2);

    if (range.start - 1 === 1 || range.end + 1 === this.pageCount) {
      range.start += 1;
      range.end += 1;
    }
    let pages: (string | number)[] =
      this.currentPage > this.delta
        ? this.getRange(Math.min(range.start, this.pageCount - this.delta), Math.min(range.end, this.pageCount))
        : this.getRange(1, Math.min(this.pageCount, this.delta + 1));

    if (this.currentPage > this.pageCount - this.boundaryPagesShown && this.pageCount > this.pagesShown) {
      pages = this.getRange(this.pageCount - this.delta, this.pageCount);
    }
    const withDots = (value: number, pair: (string | number)[]) =>
      pages.length + 1 !== this.pageCount ? pair : [value];
    const lastPage: string | number = pages[pages.length - 1];

    if (pages[0] !== 1) pages = withDots(1, [1, '...']).concat(pages);
    if (lastPage && lastPage < this.pageCount) pages = pages.concat(withDots(this.pageCount, ['...', this.pageCount]));
    return pages;
  };
}

export default PaginationGenerator;
