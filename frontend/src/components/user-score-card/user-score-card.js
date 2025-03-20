import template from "./template";
import style from "./style.css?inline";
import { addStylesheetToShadowRoot } from "../../utils/style-manipulation";

class UserScoreCard extends HTMLElement {
  static observedAttributes = ["display-name", "score", "profile-pic"];

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(template.content.cloneNode(true));
    addStylesheetToShadowRoot(style, this.shadowRoot);
  }

  attributeChangedCallback(name, oldValue, newValue) {
    switch (name) {
      case "display-name":
        this.shadowRoot.querySelector("h3").innerText = newValue || "Name";
        break;
      case "score":
        this.shadowRoot.querySelector("p").innerText = newValue ? newValue + " Points" : "Score is not avalible";
        break;
      case "profile-pic":
        this.shadowRoot.querySelector("img").src = newValue || "#";
        break;
      default:
        break;
    }
  }
}

customElements.define("user-score-card", UserScoreCard);