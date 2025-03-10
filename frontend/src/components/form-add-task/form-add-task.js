import template from "./template";
import style from "./style.css?inline";
import { addStylesheetToShadowRoot } from "../../utils/style-manipulation";
import { router } from "../../Router";
import { uploadJSON } from "../../utils/api";

class FormAddTask extends HTMLElement {
  #projectId;

  static observedAttributes = ["project-id"];

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(template.content.cloneNode(true));
    addStylesheetToShadowRoot(style, this.shadowRoot);

    this.#projectId = location.pathname.split("/").pop();
  }

  connectedCallback() {
    this.shadowRoot.getElementById("submit").onclick = (event) => this.#submitTask(event);
  }

  disconnectedCallback() {
    this.shadowRoot.getElementById("submit").onclick = null;
  }

  attributeChangedCallback(name) {
    if (name === "project-id") {
      const id = this.getAttribute("project-id");
      if (!isNaN(id)) {
        this.#projectId = id;
      }
    }
  }

  async #submitTask(event) {
    event.preventDefault();

    const form = this.shadowRoot.querySelector("form");
    const formData = new FormData(form);
    const formObject = Object.fromEntries(formData.entries());

    const response = await uploadJSON("/api/add-task", "POST", {
      projectId: this.#projectId,
      title: formObject.title,
      description: formObject.description,
      difficulty: formObject.difficulty,
      assignedTo: formObject["assigned-too"]
    });

    const taskAddedEvent = new CustomEvent("taskAdded");
    this.dispatchEvent(taskAddedEvent);
    console.log(response);
    //router.back();
  }

}

customElements.define("form-add-task", FormAddTask);