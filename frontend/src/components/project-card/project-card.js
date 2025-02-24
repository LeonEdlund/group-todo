import template from "./template";
import { SvgGenerator } from "../../classes/SvgGenerator";

class GroupCard extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(template.content.cloneNode(true));
  }

  connectedCallback() {
    this.shadowRoot.querySelector(".img-container").appendChild(SvgGenerator.generateSvg());
  }

  static get observedAttributes() {
    return ["title", "created", "progress"];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    switch (name) {
      case "title":
        const title = this.getAttribute("title") || "Title";
        this.shadowRoot.querySelector("h2").innerText = title;
        break;
      case "created":
        const createdAt = this.getAttribute("created") || "No Date";
        this.shadowRoot.querySelector(".date").innerText = createdAt;
        break;
      case "progress":
        const progress = this.getAttribute("progress") || "0%";
        this.shadowRoot.querySelector("progress-bar").setAttribute("completed", progress);
        break;
    }
  }
}

customElements.define("project-card", GroupCard);