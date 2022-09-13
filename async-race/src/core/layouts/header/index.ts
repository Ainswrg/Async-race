import Store from '@core/store';
import Component from '@core/templates/component';
import { PageIds } from '@core/ts/enum';

const Buttons = [
  {
    id: PageIds.Garage,
    text: 'To Garage',
  },
  {
    id: PageIds.Winners,
    text: `To Winners`,
  },
];

class Header extends Component {
  renderNavButtons() {
    const navButtons = document.createElement('div');
    navButtons.classList.add('header__navigation');
    this.generateButtons(navButtons);
    this.container.append(navButtons);
  }

  generateButtons(navButtons: HTMLElement) {
    Buttons.forEach((button) => {
      const navButton = document.createElement('a');
      navButton.classList.add('header__navigation-button');
      navButton.setAttribute('href', `#${button.id}`);
      Store.addToStore(`navButton${button.id}`, navButton);
      navButton.innerHTML = button.text;
      navButtons.append(navButton);
    });
  }

  render() {
    this.renderNavButtons();
    return this.container;
  }
}

export default Header;
