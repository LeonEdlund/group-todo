import template from "./template";
import style from "./style.css?inline";
import { addStylesheetToShadowRoot } from "../../utils/style-manipulation";

class BtnBigBlue extends HTMLElement {
  #clicked;

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(template.content.cloneNode(true));
    addStylesheetToShadowRoot(style, this.shadowRoot);

    this.#bindMethods();
    this.#clicked = false;
  }

  #bindMethods() {
    this.customEvents = this.customEvents.bind(this);
  }

  connectedCallback() {
    this.shadowRoot.querySelector("button").addEventListener("click", this.customEvents);
  }

  disconnectedCallback() {
    this.shadowRoot.querySelector("button").removeEventListener("click", this.customEvents);
  }

  customEvents() {
    let eventName;

    if (!this.#clicked) {
      this.#clicked = true;
      eventName = "openPopup";
      this.shadowRoot.querySelector("button").style.transform = "rotate(45deg)";
    } else {
      this.#clicked = false;
      eventName = "closePopup"
      this.shadowRoot.querySelector("button").style.transform = "rotate(0deg)";
    }

    this.dispatchEvent(new CustomEvent(eventName, { bubbles: true, composed: true }));
  }
}

customElements.define("btn-big-blue", BtnBigBlue);