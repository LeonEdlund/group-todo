import template from "./template";
import style from "./style.css?inline";
import { addStylesheetToShadowRoot } from "../../utils/style-manipulation";

class FormAddTask extends HTMLElement {
  #projectId;

  static observedAttributes = ["project-id"];

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(template.content.cloneNode(true));
    addStylesheetToShadowRoot(style, this.shadowRoot);
  }

  connectedCallback() {
    this.shadowRoot.getElementById("submit").onclick = (event) => this.#submitTask(event);
  }

  disconnectedCallback() {
    this.shadowRoot.getElementById("submit").onclick = null;
  }

  attributeChangedCallback(name) {
    if (name === "project-id") {
      this.#projectId = this.getAttribute("project-id");
    }
  }

  async #submitTask(event) {
    event.preventDefault();
    const form = this.shadowRoot.querySelector("form");
    const formData = new FormData(form);
    const formObject = Object.fromEntries(formData.entries());

    const response = await fetch(`/api/project/${this.#projectId}/tasks`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: formObject.title,
          description: formObject.description,
          score: formObject.score
        })

      });

    if (response.ok) {
      const taskAddedEvent = new CustomEvent("taskAdded");
      this.dispatchEvent(taskAddedEvent);
    } else {
      console.log("Something went wrong when uploading task");
    }
  }

}

customElements.define("form-add-task", FormAddTask);