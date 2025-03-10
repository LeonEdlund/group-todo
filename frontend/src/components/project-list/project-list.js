import template from "./template";
import style from "./style.css?inline";
import { addStylesheetToShadowRoot } from "../../utils/style-manipulation";
import { router } from "../../Router";
import createCard from "../../utils/createCard";

class ProjectList extends HTMLElement {
  #itemWrapper;

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(template.content.cloneNode(true));
    addStylesheetToShadowRoot(style, this.shadowRoot);
    this.bindMethods();

    this.#itemWrapper = this.shadowRoot.querySelector(".to-do-items-wrapper");
  }

  bindMethods() {

  }

  async connectedCallback() {
    const data = await this.#fetchData();
    this.#createCards(data);
    this.#itemWrapper.addEventListener("click", this.navigateTo);
  }

  async #fetchData() {
    const data = await fetch("/api/projects").then(response => response.json());
    return data;
  }

  #createCards(data) {
    if (data.length === 0) {
      this.#itemWrapper.innerHTML = "<p>No projects</p>";
      return;
    }

    const cards = data.map(card => createCard(card));

    this.#itemWrapper.append(...cards);
  }

  navigateTo(event) {
    const projectCard = event.target.closest("project-card");
    if (projectCard) {
      const projectId = projectCard.getAttribute("id");
      router.navigateTo(`/project/${projectId}`);
    }
  }
}

customElements.define("project-list", ProjectList);