import template from "./template";
import style from "./style.css?inline";
import threeDotsImg from "../../resources/three-dots.svg";
import { addStylesheetToShadowRoot } from "../../utils/style-manipulation";
import { SvgGenerator } from "../../classes/SvgGenerator";

class ProjectCard extends HTMLElement {
  static observedAttributes = ["title", "created", "progress", "cover_img"];

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(template.content.cloneNode(true));
    addStylesheetToShadowRoot(style, this.shadowRoot);
  }

  connectedCallback() {
    this.shadowRoot.getElementById("three-dots-img").src = threeDotsImg;
  }

  attributeChangedCallback(name) {
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
      case "cover_img":
        const coverImg = this.getAttribute("cover_img") || SvgGenerator.generateSvg().outerHTML
        this.shadowRoot.querySelector(".img-container").innerHTML = coverImg;
        break;
    }
  }
}

customElements.define("project-card", ProjectCard);