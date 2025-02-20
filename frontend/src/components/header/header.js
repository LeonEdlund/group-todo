import sharedStyles from "../../styles/shared-styles.css?inline";
import style from "./style.css?inline";

class Header extends HTMLElement {
  constructor() {
    super();
    this.shadow = this.attachShadow({ mode: 'open' });
    this.#render();
  }

  static get observedAttributes() {
    return ["btn-type"];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === "btn-type") {
      this.#updateBtn(newValue);
    }
  }

  #render() {
    this.shadow.innerHTML = `
      <style>
        ${sharedStyles}
        ${style}
      </style>

    <div class="flex-row space-between align-center header">
        <slot></slot>
        <btn-big-blue></btn-big-blue>
    </div>`;
  }

  #updateBtn(newValue) {
    if (newValue === "close") {
      this.shadow.querySelector("btn-big-blue").style.transform = "rotate(45deg)";
    } else if (newValue === "new") {
      this.shadow.querySelector("btn-big-blue").style.transform = "rotate(0deg)";
    }
  }
}

customElements.define("custom-header", Header);