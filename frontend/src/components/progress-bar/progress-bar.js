import template from "./template";

class ProgressBar extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(template.content.cloneNode(true));
  }

  static get observedAttributes() {
    return ["completed"];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === "completed") {
      this.#updateBar(newValue);
    }
  }

  #updateBar(value) {
    this.shadowRoot.getElementById("progress-bar-indicator").style.width = value;
  }
}

customElements.define("progress-bar", ProgressBar);