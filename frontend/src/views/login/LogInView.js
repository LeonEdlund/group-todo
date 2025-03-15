import template from "./template";
import style from "./style.css?inline";
import { addStylesheetToShadowRoot } from "../../utils/style-manipulation";
import basePath from "../../utils/basePath";

class LogInView extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(template.content.cloneNode(true));
    addStylesheetToShadowRoot(style, this.shadowRoot);
  }

  connectedCallback() {
    this.shadowRoot.querySelector("button").addEventListener("click", this.#redirect);
  }

  disconnectedCallback() {
    this.shadowRoot.querySelector("button").removeEventListener("click", this.#redirect);
  }

  #redirect() {
    window.location.href = `${basePath}/api/login`;
  }

}

customElements.define("login-view", LogInView);