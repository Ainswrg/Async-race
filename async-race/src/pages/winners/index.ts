import Page from '@core/templates/page';

class WinnersPage extends Page {
  static TextObject = {
    MainTitle: 'Winners Page',
  };

  async render(): Promise<HTMLElement> {
    const title = this.createHeaderTitle(WinnersPage.TextObject.MainTitle);
    this.container.append(title);
    return this.container;
  }
}

export default WinnersPage;
