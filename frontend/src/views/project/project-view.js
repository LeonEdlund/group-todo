import template from "./template";
import { router } from "../../Router";
import { getData } from "../../utils/api"

class ProjectView extends HTMLElement {
  #backBtn
  #addBtn
  #id

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(template.content.cloneNode(true));

    this.#id = location.pathname.split("/").pop();
  }

  connectedCallback() {
    this.#backBtn = this.shadowRoot.getElementById("back-btn");
    this.#addBtn = this.shadowRoot.getElementById("add-task");

    this.#backBtn.onclick = () => router.back();
    this.#addBtn.onclick = () => router.navigateTo(`/project/${this.#id}/add-task`);
    this.#fetchData();
  }

  disconnectedCallback() {
    this.#backBtn.onclick = null;
  }

  async #fetchData() {
    const id = window.location.pathname.split("/").pop();
    const data = await getData(`/api/project/${id}`);
    this.#updateUi(data);
  }

  #updateUi(data) {
    const card = this.shadowRoot.querySelector("project-card");
    card.setAttribute("title", data.title);
    card.setAttribute("cover_img", data.img);
  }
}

customElements.define("project-view", ProjectView);