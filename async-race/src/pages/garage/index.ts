import Page from '@core/templates/page';

class Garage extends Page {
  static TextObject = {
    MainTitle: 'Garage Page',
  };

  render() {
    const title = this.createHeaderTitle(Garage.TextObject.MainTitle);
    this.container.append(title);
    return this.container;
  }
}

export default Garage;
