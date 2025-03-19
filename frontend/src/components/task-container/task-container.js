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
    this.#completed = false;
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
        const completedByValue = this.getAttribute("completed-by");
        const existingCompletedBy = this.shadowRoot.querySelector("#completed-by");

        if (completedByValue && completedByValue.trim() !== "") {
          // Task is completed
          this.#completed = true;
          this.#checkbox.checked = true;

          if (!existingCompletedBy) {
            // Create completed by section
            const wrapper = document.createElement("div");
            wrapper.id = "completed-by";

            const completedTitle = document.createElement("p");
            completedTitle.innerText = "Completed By";

            const name = document.createElement("i");
            name.innerText = completedByValue;

            wrapper.append(completedTitle, name);
            this.#descriptionWrapper.appendChild(wrapper);
          } else {
            // Update existing value
            const nameElement = existingCompletedBy.querySelector("i");
            if (nameElement) {
              nameElement.innerText = completedByValue;
            }
          }
        } else {
          // Task is not completed
          this.#completed = false;
          this.#checkbox.checked = false;

          if (existingCompletedBy) {
            existingCompletedBy.remove();
          }
        }
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
    const mode = this.#completed ? "uncompleted" : "completed";

    let task = await uploadJSON(`${basePath}/api/project/${projectId}/tasks/${id}/${mode}`, "POST");
    this.setAttribute("completed-by", task.completed_by.display_name || "");

    const taskToggled = new CustomEvent("taskToggled", {
      bubbles: true,
      composed: true,
      detail: {
        progress: task.completed
      }
    });

    this.dispatchEvent(taskToggled);
  }
}

customElements.define("task-container", TaskContainer);