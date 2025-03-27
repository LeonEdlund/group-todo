import template from "./template";
import style from "./style.css?inline";
import { addStylesheetToShadowRoot } from "../../utils/style-manipulation";
import generateSvg from "../../utils/generateSvg";
import { uploadJSON } from "../../utils/api";
import { router } from "../../Router"
import basePath from "../../utils/basePath";

class UploadField extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(template.content.cloneNode(true));
    addStylesheetToShadowRoot(style, this.shadowRoot);
    this.#bindMethods();
  }

  #bindMethods() {
    this.uploadProject = this.uploadProject.bind(this);
    this.toggleInvalidClass = this.toggleInvalidClass.bind(this);
  }

  connectedCallback() {
    this.shadowRoot.querySelector("button").addEventListener("click", this.uploadProject);
    document.addEventListener("nameMenu:closed", this.toggleInvalidClass);
  }

  disconnectedCallback() {
    this.shadowRoot.querySelector("button").removeEventListener("click", this.uploadProject);
    document.removeEventListener("nameMenu:closed", this.toggleInvalidClass);
  }

  async uploadProject() {
    const title = this.shadowRoot.querySelector("input").value;

    if (!title) {
      this.toggleInvalidClass();
      return;
    };

    const response = await uploadJSON(`${basePath}/api/add-project`, "POST", {
      title: this.shadowRoot.querySelector("input").value,
      svg: generateSvg().outerHTML
    });

    if (response.id) {
      router.navigateTo(`project/${response.id}`);
    }
  }

  toggleInvalidClass() {
    this.shadowRoot.querySelector(".name-input-wrapper").classList.toggle("invalid");
  }
}

customElements.define("upload-field", UploadField);