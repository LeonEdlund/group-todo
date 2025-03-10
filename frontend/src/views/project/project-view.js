import template from "./template";
import style from "./style.css?inline";
import { addStylesheetToShadowRoot } from "../../utils/style-manipulation";
import { router } from "../../Router";
import { getData } from "../../utils/api";
import createCard from "../../utils/createCard";
import createTask from "../../utils/createTask";

class ProjectView extends HTMLElement {
  #id;
  #backBtn;
  #addBtn;
  #taskWrapper;
  #cardWrapper;

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(template.content.cloneNode(true));
    addStylesheetToShadowRoot(style, this.shadowRoot);
  }

  async connectedCallback() {
    this.#id = location.pathname.split("/").pop();
    this.#backBtn = this.shadowRoot.getElementById("back-btn");
    this.#addBtn = this.shadowRoot.getElementById("add-task");
    this.#taskWrapper = this.shadowRoot.getElementById("tasks-wrapper");
    this.#cardWrapper = this.shadowRoot.getElementById("card-wrapper");

    this.#backBtn.onclick = () => router.back();
    this.#addBtn.onclick = () => {
      this.shadowRoot.querySelector("dialog").showModal();
    };

    this.shadowRoot.querySelector("form-add-task").addEventListener("taskAdded", async () => {
      this.shadowRoot.querySelector("dialog").close();
      const tasks = await this.#fetchTasks();
      this.#createTask(tasks);
    })

    const cardData = await this.#fetchProjectInfo();
    const tasks = await this.#fetchTasks();
    this.#createTask(tasks);
    this.#updateCard(cardData);
  }

  disconnectedCallback() {
    this.#backBtn.onclick = null;
  }

  async #fetchProjectInfo() {
    return await getData(`/api/project/${this.#id}`);
  }

  async #fetchTasks() {
    return await getData(`/api/tasks/${this.#id}`);
  }

  #updateCard(data) {
    const card = createCard(data);
    this.#cardWrapper.appendChild(card);
  }

  #createTask(tasks) {
    if (!tasks.length) {
      this.#taskWrapper.innerHTML = "<p>No tasks...</p>";
      return;
    }

    const taskElems = tasks.map(task => createTask(task));

    this.#taskWrapper.innerHTML = "";
    this.#taskWrapper.append(...taskElems);
  }
}

customElements.define("project-view", ProjectView);