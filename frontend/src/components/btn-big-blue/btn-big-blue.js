import sharedStyles from "../../styles/shared-styles.css?inline";
import style from "./style.css?inline";

class BtnBigBlue extends HTMLElement {
  #clicked;
  constructor() {
    super();
    this.#clicked = false;
    this.render();
    this.addCustomEvents();
  }

  render() {
    this.shadow = this.attachShadow({ mode: 'open' });
    this.shadow.innerHTML = `
      <style>
        ${sharedStyles}
        ${style}
      </style>
      <button>+</button>`;
  }

  addCustomEvents() {
    this.shadow.querySelector("button").addEventListener("click", (event) => {
      let eventName;

      if (!this.#clicked) {
        this.#clicked = true;
        eventName = "openPopup";
        this.shadow.querySelector("button").style.transform = "rotate(45deg)";
      } else {
        this.#clicked = false;
        eventName = "closePopup"
        this.shadow.querySelector("button").style.transform = "rotate(0deg)";
      }

      this.dispatchEvent(new CustomEvent(eventName, { bubbles: true, composed: true }));
    })
  }

}

customElements.define("btn-big-blue", BtnBigBlue);