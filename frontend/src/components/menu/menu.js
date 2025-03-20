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

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(template.content.cloneNode(true));
    addStylesheetToShadowRoot(style, this.shadowRoot);
    this.#bindMethods();

    this.#projectId;
  }

  set projectId(id) {
    this.#projectId = id;
  }

  #bindMethods() {
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

  close(event) {
    if (event.target.id !== "overlay") return;
    this.#animateOut();
  }

  /**
   * Delete a project
   */
  async delete() {
    const response = await fetch(`${basePath}/api/project/${this.#projectId}/delete`, {
      method: "POST"
    });

    this.#showFeedback(response.ok);
  }

  //--------------------------------------------------------------------------
  // ANIMATIONS 
  //--------------------------------------------------------------------------

  #animateIn() {
    gsap.set(this.#overlay, { opacity: 0 });

    gsap.to(this.#overlay, {
      opacity: 1,
      duration: 0.2
    });

    gsap.from(this.#wrapper, { y: 200 });
  }

  #animateOut() {
    //animate out
    gsap.to(this.#overlay, {
      opacity: 0,
      duration: 0.2
    });

    gsap.to(this.#wrapper, { y: 400, onComplete: () => { this.remove(); } });
  }

  #showFeedback(suceeded) {
    const feedback = document.createElement("div");

    feedback.id = "feedback";
    feedback.innerHTML += suceeded ? "<small-loader></small-loader><p>Deleting</p>" : "<p>Something went wrong</p>";
    this.shadowRoot.appendChild(feedback);

    gsap.to(feedback, {
      y: 120, duration: 0.2, onComplete: () => {
        setTimeout(() => {
          if (suceeded) {
            router.navigateTo("/")
          } else {
            feedback.remove()
          }
        }, 1000);
      }
    });
  }
}

customElements.define("custom-menu", Menu);