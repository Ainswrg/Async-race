import Winners from '@core/components/winners';
import Page from '@core/templates/page';

class WinnersPage extends Page {
  async render(): Promise<HTMLElement> {
    const winners = new Winners('div', 'winners');
    this.container.append(await winners.renderWinners());
    return this.container;
  }
}

export default WinnersPage;
