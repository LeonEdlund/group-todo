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
    this.addInvalidClass = this.addInvalidClass.bind(this);
    this.removeInvalidClass = this.removeInvalidClass.bind(this);
  }

  connectedCallback() {
    this.shadowRoot.querySelector("button").addEventListener("click", this.uploadProject);
    document.addEventListener("nameMenu:closed", this.removeInvalidClass);
  }

  disconnectedCallback() {
    this.shadowRoot.querySelector("button").removeEventListener("click", this.uploadProject);
    document.removeEventListener("nameMenu:closed", this.removeInvalidClass);
  }

  async uploadProject() {
    const title = this.shadowRoot.querySelector("input").value;

    if (!title) {
      this.addInvalidClass();
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

  addInvalidClass() {
    this.shadowRoot.querySelector(".name-input-wrapper").classList.add("invalid");
  }

  removeInvalidClass() {
    this.shadowRoot.querySelector(".name-input-wrapper").classList.remove("invalid");
  }
}

customElements.define("upload-field", UploadField);