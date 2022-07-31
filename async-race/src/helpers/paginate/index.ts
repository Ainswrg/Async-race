const getRange = (start: number, end: number) => {
  const length = end - start + 1;
  return Array.from({ length }, (_, i) => start + i);
};

const clamp = (number: number, lower: number, upper: number) => {
  return Math.min(Math.max(number, lower), upper);
};

const getPaginationGenerator = (
  currentPageNumber: number,
  pageCount: number,
  showPages: number = 5,
  MINIMUM_PAGE_SIZE: number = 7
) => {
  let delta: number;
  const currentPage = clamp(currentPageNumber, 1, pageCount);
  const pagesShown = clamp(showPages, MINIMUM_PAGE_SIZE, pageCount);
  const centerPagesShown = pagesShown - 5;
  const boundaryPagesShown = pagesShown - 3;

  if (pageCount <= pagesShown) {
    delta = pagesShown;
  } else {
    delta =
      currentPage < boundaryPagesShown || currentPage > pageCount - boundaryPagesShown
        ? boundaryPagesShown
        : centerPagesShown;
  }

  const range = {
    start: Math.round(currentPage - delta / 2),
    end: Math.round(currentPage + delta / 2),
  };

  if (range.start - 1 === 1 || range.end + 1 === pageCount) {
    range.start += 1;
    range.end += 1;
  }
  let pages: (string | number)[] =
    currentPage > delta
      ? getRange(Math.min(range.start, pageCount - delta), Math.min(range.end, pageCount))
      : getRange(1, Math.min(pageCount, delta + 1));

  if (currentPage > pageCount - boundaryPagesShown && pageCount > pagesShown) {
    pages = getRange(pageCount - delta, pageCount);
  }

  const withDots = (value: number, pair: (string | number)[]) => (pages.length + 1 !== pageCount ? pair : [value]);
  const lastPage = pages[pages.length - 1];

  if (pages[0] !== 1) {
    pages = withDots(1, [1, '...']).concat(pages);
  }

  if (lastPage && lastPage < pageCount) {
    pages = pages.concat(withDots(pageCount, ['...', pageCount]));
  }

  return pages;
};

export default getPaginationGenerator;
