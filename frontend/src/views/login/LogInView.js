import template from "./template";
import style from "./style.css?inline";
import { addStylesheetToShadowRoot } from "../../utils/style-manipulation";

class LogInView extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(template.content.cloneNode(true));
    addStylesheetToShadowRoot(style, this.shadowRoot);
  }

  connectedCallback() {
  }

}

customElements.define("login-view", LogInView);