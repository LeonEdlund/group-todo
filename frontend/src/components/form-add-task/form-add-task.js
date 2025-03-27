import template from "./template";
import style from "./style.css?inline";
import { addStylesheetToShadowRoot } from "../../utils/style-manipulation";
import basePath from "../../utils/basePath";

class FormAddTask extends HTMLElement {
  #projectId;

  static observedAttributes = ["project-id"];

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(template.content.cloneNode(true));
    addStylesheetToShadowRoot(style, this.shadowRoot);
    this.#bindMethods();
  }

  #bindMethods() {
    this.submitTask = this.submitTask.bind(this);
    this.clearForm = this.clearForm.bind(this);
  }

  connectedCallback() {
    this.shadowRoot.getElementById("submit").addEventListener("click", this.submitTask);
    document.addEventListener("addTaskModal:close", this.clearForm);
  }

  disconnectedCallback() {
    this.shadowRoot.getElementById("submit").removeEventListener("click", this.submitTask);
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === "project-id") {
      this.#projectId = newValue;
    }
  }

  async submitTask(event) {
    event.preventDefault();
    const form = this.shadowRoot.querySelector("form");
    const formData = new FormData(form);
    const formObject = Object.fromEntries(formData.entries());

    if (!this.formValidated(formObject)) {
      return;
    }

    try {
      const response = await fetch(`${basePath}/api/project/${this.#projectId}/tasks`,
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
        console.error("Something went wrong when uploading task", response);
      }

    } catch (e) {
      console.error("Something went wrong when uploading task", e);
    }
  }

  formValidated(form) {
    let validated = true;
    const title = this.shadowRoot.querySelector("#title");
    const score = this.shadowRoot.querySelector("#score");

    title.classList.remove("invalid");
    score.classList.remove("invalid");

    if (!form.title) {
      title.classList.add("invalid");
      validated = false;
    }

    if (!form.score) {
      score.classList.add("invalid");
      validated = false;
    }

    return validated;
  }

  clearForm() {
    const title = this.shadowRoot.querySelector("#title");
    const score = this.shadowRoot.querySelector("#score");

    title.classList.remove("invalid");
    score.classList.remove("invalid");

    this.shadowRoot.querySelector("form").reset();
  }
}

customElements.define("form-add-task", FormAddTask);