import template from "./template";
import style from "./style.css?inline";

class Home extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(template.content.cloneNode(true));
  }

  connectedCallback() {
    this.addEventListener("openPopup", this.openPopUp);
    this.addEventListener("closePopup", this.closePopUp);
  }

  openPopUp(event) {
    this.#updateHeaderTitle("Create<br>New Project");
    this.shadowRoot.querySelector("#pop-up").classList.remove("hidden");
    this.#allowScroll(false);
  }

  closePopUp() {
    this.#updateHeaderTitle("Your<br>Projects");
    this.shadowRoot.querySelector("#pop-up").classList.add("hidden");
    this.#allowScroll(true);
  }

  #updateHeaderTitle(title) {
    this.shadowRoot.querySelector("custom-header").setAttribute("title", title);
  }

  #allowScroll(allowed) {
    if (allowed) {
      document.documentElement.style.overflow = "scroll"; // html
      document.body.style.overflowY = "scroll";
    } else if (!allowed) {
      document.documentElement.style.overflow = "hidden";
      document.body.style.overflowY = "hidden";
    }
  }
}

customElements.define("home-view", Home);