import template from "./template";
import { SvgGenerator } from "../../classes/SvgGenerator";

class UploadField extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(template.content.cloneNode(true));
    this.self = this;
  }

  connectedCallback() {
    this.shadowRoot.querySelector("button").addEventListener("click", this.#uploadProject.bind(this));
  }

  #uploadProject() {
    const projectInfo = {
      title: this.shadowRoot.querySelector("input").value,
      owner: "Leon Edlund",
      coverImg: SvgGenerator.generateSvg()
    }

    if (projectInfo.title.length > 0) {
      console.log(`upload: ${projectInfo.title}, ${projectInfo.coverImg.outerHTML}`);
    } else {
      console.log("provide a name");
    }
  }
}

customElements.define("upload-field", UploadField);