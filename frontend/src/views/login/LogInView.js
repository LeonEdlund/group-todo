import template from "./template";
import style from "./style.css?inline";
import { addStylesheetToShadowRoot } from "../../utils/style-manipulation";
import basePath from "../../utils/basePath";

class LogInView extends HTMLElement {
  #button;

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(template.content.cloneNode(true));
    addStylesheetToShadowRoot(style, this.shadowRoot);
  }

  connectedCallback() {
    this.#button = this.shadowRoot.querySelector("button");
    this.#button.addEventListener("click", this.#redirect);
  }

  disconnectedCallback() {
    this.#button.removeEventListener("click", this.#redirect);
  }

  #redirect() {
    window.location.href = `${basePath}/api/login`;
  }
}

customElements.define("login-view", LogInView);