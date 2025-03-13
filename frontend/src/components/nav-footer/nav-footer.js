import template from "./template";
import style from "./style.css?inline";
import { addStylesheetToShadowRoot } from "../../utils/style-manipulation";

class NavFooter extends HTMLElement {
  static observedAttributes = ["profile-pic"]

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(template.content.cloneNode(true));
    addStylesheetToShadowRoot(style, this.shadowRoot);
  }

  connectedCallback() {
    this.shadowRoot.querySelector("button").addEventListener("click", this.#logout);
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === "profile-pic") {
      this.shadowRoot.querySelector("img").src = this.getAttribute("profile-pic");
    }
  }

  #logout() {
    window.location.href = "/api/logout";
  }
}

customElements.define("nav-footer", NavFooter);