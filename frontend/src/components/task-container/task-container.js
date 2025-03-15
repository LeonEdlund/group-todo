import template from "./template";
import style from "./style.css?inline";
import { addStylesheetToShadowRoot } from "../../utils/style-manipulation";
import { uploadJSON } from "../../utils/api";
import basePath from "../../utils/basePath";

class TaskContainer extends HTMLElement {
  #expanded;
  #completed;
  #arrowBtn;
  #checkbox;
  #descriptionWrapper;

  static observedAttributes = ["title", "score", "description", "completed-by"];

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(template.content.cloneNode(true));
    addStylesheetToShadowRoot(style, this.shadowRoot);

    this.#expanded = false;
    this.#arrowBtn = this.shadowRoot.getElementById("arrow-btn");
    this.#checkbox = this.shadowRoot.getElementById("ch1");
    this.#descriptionWrapper = this.shadowRoot.getElementById("description-wrapper");
  }

  connectedCallback() {
    this.#arrowBtn.onclick = () => { this.expand(); };
    this.#checkbox.onclick = () => { this.toggleCheckbox() };
  }

  disconnectedCallback() {
    this.#arrowBtn.onclick = null;
    this.#checkbox.onclick = null;
  }

  attributeChangedCallback(name, oldValue, newValue) {
    switch (name) {
      case "title":
        const title = this.getAttribute("title") || "Title";
        this.shadowRoot.querySelector("#task-title").innerText = title;
        break;
      case "description":
        const description = this.getAttribute("description") || "No description";
        this.shadowRoot.getElementById("description").innerText = description;
        break;
      case "score":
        const score = this.getAttribute("score");
        this.shadowRoot.getElementById("assigned").innerText = `Points: ${score}`;
        break;
      case "completed-by":
        this.#completed = true;

        // create completed by section
        const completedTitle = document.createElement("p");
        completedTitle.innerText = "Completed By";
        const name = document.createElement("i");
        name.innerText = this.getAttribute("completed-by")
        completedTitle.appendChild(name);
        this.#descriptionWrapper.append(completedTitle, name);

        //Fill checkbox
        this.#checkbox.checked = true;

        break;
    }
  }

  expand() {
    if (!this.#expanded) {
      this.#expanded = true;
      this.#arrowBtn.style.transform = "rotate(-180deg)";
      this.#descriptionWrapper.classList.add("expanded");
    } else if (this.#expanded) {
      this.#expanded = false;
      this.#arrowBtn.style.transform = "rotate(0deg)";
      this.#descriptionWrapper.classList.remove("expanded");
    }
  }

  async toggleCheckbox() {
    const projectId = this.getAttribute("project-id");
    const id = this.getAttribute("id");
    let progress;

    if (!this.#completed) {
      progress = await uploadJSON(`${basePath}/api/project/${projectId}/tasks/${id}/completed`, "PATCH");
      this.#completed = true;
    } else {
      progress = await uploadJSON(`${basePath}/api/project/${projectId}/tasks/${id}/uncompleted`, "PATCH");
      this.#completed = false;
    }

    const taskToggled = new CustomEvent("taskToggled", {
      bubbles: true,
      composed: true,
      detail: {
        progress: progress
      }
    });

    this.dispatchEvent(taskToggled);
  }
}

customElements.define("task-container", TaskContainer);