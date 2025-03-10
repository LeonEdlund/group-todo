import template from "./template";
import style from "./style.css?inline";
import { addStylesheetToShadowRoot } from "../../utils/style-manipulation";
import { SvgGenerator } from "../../classes/SvgGenerator";
import { uploadJSON } from "../../utils/api";
import { router } from "../../Router"

class UploadField extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(template.content.cloneNode(true));
    addStylesheetToShadowRoot(style, this.shadowRoot);
  }

  connectedCallback() {
    this.shadowRoot.querySelector("button").onclick = () => { this.#uploadProject() };
  }

  disconnectedCallback() {
    this.shadowRoot.querySelector("button").onclick = null;
  }

  async #uploadProject() {
    const title = this.shadowRoot.querySelector("input").value;

    if (!title) {
      console.log("provide a name");
      return;
    };

    const response = await uploadJSON("/api/add-project", "POST", {
      title: this.shadowRoot.querySelector("input").value,
      owner: "1",
      svg: SvgGenerator.generateSvg().outerHTML
    });

    if (response.id) {
      router.navigateTo(`project/${response.id}`);
    }
  }
}

customElements.define("upload-field", UploadField);