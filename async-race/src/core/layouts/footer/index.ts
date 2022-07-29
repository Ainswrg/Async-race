import Component from '@core/templates/component';
import { Url } from '@core/ts/enum';

const Links = [
  {
    text: '2022 Original Ainswrg',
    url: Url.author,
  },
  {
    text: '<img class="logo" src="https://rs.school/images/rs_school_js.svg" alt="rs_school_js" id="rs" />',
    url: Url.school,
  },
];

class Footer extends Component {
  renderFooterContent() {
    const footerContent = document.createElement('ul');
    footerContent.classList.add('footer__contacts');
    const contactsItem = document.createElement('li');
    contactsItem.classList.add('footer__contacts-item');
    footerContent.append(contactsItem);
    this.container.append(footerContent);
    this.enableListenersOnButton(contactsItem);
  }

  enableListenersOnButton(contactsItem: HTMLElement) {
    Links.forEach((link) => {
      const contactLink = document.createElement('a');
      contactLink.addEventListener('click', () => window.open(link.url));
      contactLink.innerHTML = link.text;
      contactsItem.append(contactLink);
    });
  }

  render() {
    this.renderFooterContent();
    return this.container;
  }
}

export default Footer;
