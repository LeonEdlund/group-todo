import sharedStyles from "../../styles/shared-styles.css?inline";
import style from "./style.css?inline";

class BtnBigBlue extends HTMLElement {
  constructor() {
    super();
    this.render();
  }

  render() {
    this.shadow = this.attachShadow({ mode: 'open' });
    this.shadow.innerHTML = `
      <style>
        ${sharedStyles}
        ${style}
      </style>
      <button onclick="window.location = 'new-project.html'">+</button>`;
  }
}

customElements.define("btn-big-blue", BtnBigBlue);