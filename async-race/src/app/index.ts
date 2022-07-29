import Page from '@core/templates/page';
import { ErrorTypes, PageIds } from '@core/ts/enum';
import { Main, Header, Footer } from '@core/layouts';
import { Garage, Winners, ErrorPage } from '@pages/index';

class App {
  private static body: HTMLElement = document.body;
  private static url: string | null = PageIds.Default;
  private static main: Main = new Main('main', 'main');
  private static header: Header = new Header('header', 'header');
  private static footer: Footer = new Footer('footer', 'footer');

  static renderNewPage(idPage: string): void {
    if (App.url) {
      App.url = null;
    }
    let page: Page | null = null;

    switch (idPage) {
      case PageIds.Garage:
        page = new Garage(idPage);
        App.url = idPage;
        break;
      case PageIds.Winners:
        page = new Winners(idPage);
        App.url = idPage;
        break;
      default:
        page = new ErrorPage(idPage, ErrorTypes.Error_404);
        App.url = idPage;
        break;
    }

    if (page) {
      (async () => {
        const pageHTML = await page.render();
        App.url = PageIds.Default;
        App.main.rerender().append(pageHTML);
      })();
    }
  }

  private enableRouteChange(): void {
    window.addEventListener('hashchange', () => {
      const hash = window.location.hash.slice(1);
      App.renderNewPage(hash);
    });
  }

  generatePage(): void {
    const wrapper = document.createElement('div');
    wrapper.classList.add('page-wrapper');
    wrapper.append(App.header.render());
    wrapper.append(App.main.render());
    wrapper.append(App.footer.render());
    App.body.append(wrapper);
  }

  run(): void {
    this.generatePage();
    this.enableRouteChange();
    App.renderNewPage(PageIds.Garage);
  }
}

export default App;
