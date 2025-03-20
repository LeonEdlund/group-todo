import template from "./template";
import style from "./style.css?inline";
import threeDotsImg from "../../resources/three-dots.svg";
import { addStylesheetToShadowRoot } from "../../utils/style-manipulation";
import generateSvg from "../../utils/generateSvg";

class ProjectCard extends HTMLElement {
  #projectId;

  static observedAttributes = ["title", "created", "progress", "cover_img"];

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(template.content.cloneNode(true));
    addStylesheetToShadowRoot(style, this.shadowRoot);
    this.#bindMethods();
  }

  set projectId(id) {
    this.#projectId = id;
  }

  connectedCallback() {
    this.shadowRoot.getElementById("three-dots-img").src = threeDotsImg;
    this.addEventListener("click", this.#cardClick);
    this.shadowRoot.getElementById("btn-three-dots").addEventListener("click", this.menuEvent);
  }

  disconnectedCallback() {
    this.shadowRoot.getElementById("btn-three-dots").removeEventListener("click", this.menuEvent);
  }

  #bindMethods() {
    this.menuEvent = this.menuEvent.bind(this);
  }

  attributeChangedCallback(name, oldValue, newValue) {
    switch (name) {
      case "title":
        this.shadowRoot.querySelector("h2").innerText = newValue || "Title";
        break;
      case "created":
        this.shadowRoot.querySelector(".date").innerText = newValue || "No Date";
        break;
      case "progress":
        const progress = newValue || "0%";
        this.shadowRoot.querySelector("progress-bar").setAttribute("completed", progress);
        break;
      case "cover_img":
        this.shadowRoot.querySelector(".img-container").innerHTML = newValue || generateSvg().outerHTML;
        break;
    }
  }

  #cardClick(e) {
    const cardEvent = new CustomEvent("card:card-clicked", {
      bubbles: true,
      composed: true,
      detail: {
        id: this.#projectId,
      }
    });
    this.dispatchEvent(cardEvent);
  }

  menuEvent(e) {
    e.stopPropagation();

    const menuEvent = new CustomEvent("card:menu-clicked", {
      bubbles: true,
      composed: true,
      detail: {
        id: this.#projectId,
      }
    });
    this.dispatchEvent(menuEvent);
  }
}

customElements.define("project-card", ProjectCard);