import Component from '@core/templates/component';

class Main extends Component {
  renderMain() {
    const main = document.createElement('main');
    main.classList.add('main');
  }

  rerender() {
    this.container.innerHTML = '';
    this.renderMain();
    return this.container;
  }

  render() {
    this.renderMain();
    return this.container;
  }
}

export default Main;
