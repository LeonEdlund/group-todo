import template from "./template";
import style from "./style.css?inline";
import { addStylesheetToShadowRoot } from "../../utils/style-manipulation";
import basePath from "../../utils/basePath";

class NavFooter extends HTMLElement {
  static observedAttributes = ["profile-pic"]

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(template.content.cloneNode(true));
    addStylesheetToShadowRoot(style, this.shadowRoot);
    this.bindMethods();
  }

  bindMethods() {
    this.toggleLogout = this.toggleLogout.bind(this);
  }

  connectedCallback() {
    this.shadowRoot.querySelector("img").addEventListener("click", this.toggleLogout);
    this.shadowRoot.querySelector("button").addEventListener("click", this.#logout);
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === "profile-pic") {
      this.shadowRoot.querySelector("img").src = newValue;
    }
  }

  toggleLogout() {
    this.shadowRoot.querySelector("div").classList.toggle("slide-out");
  }

  #logout() {
    window.location.href = `${basePath}/api/logout`;
  }
}

customElements.define("nav-footer", NavFooter);