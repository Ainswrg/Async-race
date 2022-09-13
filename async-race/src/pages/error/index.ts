import Page from '@core/templates/page';
import { ErrorTypes } from '@core/ts/enum';

class ErrorPage extends Page {
  private errorType: ErrorTypes | string;

  static TextObject: { [prop: string]: string } = {
    '404': 'Error! The page was not found.',
  };

  constructor(id: string, errorType: ErrorTypes | string) {
    super(id);
    this.errorType = errorType;
  }

  generateBodyContent(): void {
    const wrapper = document.createElement('div');
    wrapper.classList.add('page-error-wrapper');
    const center = document.createElement('div');
    center.classList.add('center');
    const title = document.createElement('h1');
    title.id = 'word';

    const word = 'Error! The page was not found.';
    const wordArray = word.split('');
    wordArray.forEach((letter, index) => {
      const span = document.createElement('span');
      span.innerHTML = letter;
      span.classList.add('letter');
      span.classList.add(`letter-${index}`);
      title.append(span);
    });
    center.append(title);
    wrapper.append(center);
    this.container.append(wrapper);
  }

  async render(): Promise<HTMLElement> {
    this.generateBodyContent();
    return this.container;
  }
}

export default ErrorPage;
