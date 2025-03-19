import template from "./template";
import style from "./style.css?inline";
import { addStylesheetToShadowRoot } from "../../utils/style-manipulation";
import basePath from "../../utils/basePath";
import { router } from "../../Router";

import { gsap } from "gsap";

class Menu extends HTMLElement {
  #overlay;
  #wrapper;
  #deleteBtn;
  #projectId;

  static observedAttributes = ["title", "project-id"];

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(template.content.cloneNode(true));
    addStylesheetToShadowRoot(style, this.shadowRoot);

    this.close = this.close.bind(this);
    this.delete = this.delete.bind(this);
  }

  connectedCallback() {
    this.#overlay = this.shadowRoot.getElementById("overlay");
    this.#wrapper = this.shadowRoot.getElementById("wrapper");
    this.#deleteBtn = this.shadowRoot.getElementById("delete")

    this.#overlay.addEventListener("click", this.close);
    this.#deleteBtn.addEventListener("click", this.delete);
    this.#animateIn();
  }

  attributeChangedCallback(name, oldValue, newValue) {
    switch (name) {
      case "project-id":
        this.#projectId = newValue;
        break;
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
    if (event.target.id !== "overlay") return;
    //animate out
    gsap.to(this.#overlay, {
      opacity: 0,
      duration: 0.3
    });

    gsap.to(this.#wrapper, { y: 400, onComplete: () => { this.remove(); } });
  }

  async delete() {
    const feedback = document.createElement("div");
    feedback.id = "feedback";

    const onFeedback = (reRoute) => {
      if (reRoute) {
        router.navigateTo("/")
      } else {
        feedback.remove()
      }
    }

    const response = await fetch(`${basePath}/api/project/${this.#projectId}`, {
      method: "DELETE"
    });

    feedback.innerHTML = response.ok ? "<p>Project Deleted</p>" : "<p>Something went wrong</p>";
    this.shadowRoot.appendChild(feedback);

    gsap.to(feedback, {
      y: 120, duration: 0.3, onComplete: () => {
        setTimeout(() => {
          onFeedback();
        }, 1000); // 1 second delay
      }
    });
  }
}

customElements.define("custom-menu", Menu);