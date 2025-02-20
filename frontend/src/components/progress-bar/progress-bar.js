import sharedStyles from "../../styles/shared-styles.css?inline";
import style from "./style.css?inline";

class ProgressBar extends HTMLElement {
  constructor() {
    super();
    this.shadow = this.attachShadow({ mode: 'open' });
    this.#render();
  }

  static get observedAttributes() {
    return ["completed"];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === "completed") {
      this.#updateBar(newValue);
    }
  }

  #render() {
    this.shadow.innerHTML = `
      <style>
        ${sharedStyles}
        ${style}
      </style>
      
      <div id="progress-bar">
        <div id="progress-bar-indicator"></div>
      </div>`;
  }

  #updateBar(value) {
    this.shadow.getElementById("progress-bar-indicator").style.width = value;
  }
}

customElements.define("progress-bar", ProgressBar);