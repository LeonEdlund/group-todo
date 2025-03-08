import template from "./template";
import style from "./style.css?inline";
import { addStylesheetToShadowRoot } from "../../utils/style-manipulation";

class TaskContainer extends HTMLElement {
  #expanded;
  #arrowBtn;

  static observedAttributes = ["title", "assigned"];
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(template.content.cloneNode(true));
    addStylesheetToShadowRoot(style, this.shadowRoot);

    this.#expanded = false;
    this.#arrowBtn = this.shadowRoot.getElementById("arrow-btn");
  }

  connectedCallback() {
    this.#arrowBtn.onclick = () => { this.expand() };
  }

  attributeChangedCallback(name, oldValue, newValue) {
    switch (name) {
      case "title":
        const title = this.getAttribute("title") || "Title";
        this.shadowRoot.querySelector("#task-title").innerText = title;
        break;
      case "assigned":
        const assigned = this.getAttribute("assigned") || "Nobody is assigned";
        this.shadowRoot.querySelector("i").innerText = assigned;
        break;
    }
  }

  expand() {
    const descriptionWrapper = this.shadowRoot.getElementById("description-wrapper");

    if (!this.#expanded) {
      this.#expanded = true;
      this.#arrowBtn.style.transform = "rotate(-180deg)";
      descriptionWrapper.classList.add("expanded");
    } else if (this.#expanded) {
      this.#expanded = false;
      this.#arrowBtn.style.transform = "rotate(0deg)";
      descriptionWrapper.classList.remove("expanded");
    }
  }
}

customElements.define("task-container", TaskContainer);