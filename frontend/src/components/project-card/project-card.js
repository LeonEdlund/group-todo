import sharedStyles from "../../styles/shared-styles.css?inline";
import style from "./style.css?inline";
import { SvgGenerator } from "../../classes/SvgGenerator";

class GroupCard extends HTMLElement {
  constructor() {
    super();
    this.shadow = this.attachShadow({ mode: 'open' });
    this.#render();
  }

  #render() {
    this.shadow.innerHTML = `
      <style>
        ${sharedStyles}
        ${style}
      </style>

    <div class="to-do-items-wrapper">
      <div class="todo-group-item">
        <div class="img-container"></div>
        <div class="todo-group-item-wrapper">
          <div class="flex-row space-between align-center">
            <h2 class="todo-group-item-title">My First group project</h2>
            <button class="btn-three-dots"><img src="src/resources/three-dots.svg" alt="three-dots"></button>
          </div>
          <ul class="reset-ul">
            <li><i>Leon Edlund</i></li>
            <li><i>Theo Myrvold</i></li>
            <li><i>Jesper Milton</i></li>
            <li><i>+2</i></li>
          </ul>
          <p class="date place-right">19/02-25</p>
          <progress-bar completed="71%" ></progress-bar>
        </div>
      </div>`;

    this.shadow.querySelector(".img-container").appendChild(SvgGenerator.generateSvg());
  }
}

customElements.define("project-card", GroupCard);