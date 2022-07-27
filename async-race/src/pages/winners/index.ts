import Page from '@core/templates/page';

class Winners extends Page {
  static TextObject = {
    MainTitle: 'Winners Page',
  };

  render() {
    const title = this.createHeaderTitle(Winners.TextObject.MainTitle);
    this.container.append(title);
    return this.container;
  }
}

export default Winners;
