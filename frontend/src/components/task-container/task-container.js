import template from "./template";
import style from "./style.css?inline";
import { addStylesheetToShadowRoot } from "../../utils/style-manipulation";
import { uploadJSON } from "../../utils/api";

class TaskContainer extends HTMLElement {
  #expanded;
  #completed;
  #arrowBtn;
  #checkbox;

  static observedAttributes = ["title", "assigned", "difficulty", "description", "completed"];

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(template.content.cloneNode(true));
    addStylesheetToShadowRoot(style, this.shadowRoot);

    this.#expanded = false;
    this.#completed = false;
    this.#arrowBtn = this.shadowRoot.getElementById("arrow-btn");
    this.#checkbox = this.shadowRoot.getElementById("ch1");
  }

  connectedCallback() {
    this.#arrowBtn.onclick = () => { this.expand(); };
    this.#checkbox.onclick = () => { this.toggleCheckbox() };
  }

  disconectedCallback() {
    this.#arrowBtn.onclick = null;
  }

  attributeChangedCallback(name, oldValue, newValue) {
    switch (name) {
      case "title":
        const title = this.getAttribute("title") || "Title";
        this.shadowRoot.querySelector("#task-title").innerText = title;
        break;
      case "assigned":
        const assigned = this.getAttribute("assigned") || "Nobody is assigned";
        this.shadowRoot.getElementById("assigned").innerText = assigned;
        break;
      case "difficulty":
        const difficulty = this.getAttribute("difficulty") || "Nobody is assigned";
        this.shadowRoot.getElementById("difficulty").innerText = difficulty;
        break;
      case "description":
        const description = this.getAttribute("description") || "No description";
        this.shadowRoot.getElementById("description").innerText = description;
        break;
      case "completed":
        const completed = this.getAttribute("completed") || "not completed";

        if (completed === "completed") {
          this.#checkbox.checked = true;
          this.#completed = true;
        } else {
          this.#checkbox.checked = false;
          this.#completed = false;
        }

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

  async toggleCheckbox() {
    const id = this.getAttribute("id");
    if (!this.#completed) {
      console.log(this.getAttribute("id"))
      this.setAttribute("completed", "completed");
    } else {
      this.setAttribute("completed", "not completed");
    }

    const response = await uploadJSON("/api/task/update-completion", "PATCH", {
      id: id,
      status: this.getAttribute("completed"),
      //add user id
    });
    console.log(response)

  }
}

customElements.define("task-container", TaskContainer);