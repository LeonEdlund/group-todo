import template from "./template";
import style from "./style.css?inline";
import { addStylesheetToShadowRoot } from "../../utils/style-manipulation";
import { gsap } from "gsap";

class Menu extends HTMLElement {
  #overlay;
  #wrapper;

  static observedAttributes = ["title"];

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(template.content.cloneNode(true));
    addStylesheetToShadowRoot(style, this.shadowRoot);

    this.close = this.close.bind(this);
  }

  connectedCallback() {
    this.#overlay = this.shadowRoot.getElementById("overlay");
    this.#wrapper = this.shadowRoot.getElementById("wrapper");
    this.#overlay.addEventListener("click", this.close);
    this.#animateIn();

  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === "title") {
      this.shadowRoot.querySelector("h2").innerText = this.getAttribute("title");
    }
  }

  #animateIn() {
    gsap.set(this.#overlay, { opacity: 0 });

    gsap.to(this.#overlay, {
      opacity: 1,
      duration: 0.3
    });

    gsap.from(this.#wrapper, { y: 200 });
  }

  close(event) {
    if (event.target.id === "wrapper") return;
    //animate out
    gsap.to(this.#overlay, {
      opacity: 0,
      duration: 0.3
    });

    gsap.to(this.#wrapper, { y: 400, onComplete: () => { this.remove(); } });
  }
}

customElements.define("custom-menu", Menu);