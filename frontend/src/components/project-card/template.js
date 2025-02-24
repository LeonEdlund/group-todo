import sharedStyles from "../../styles/shared-styles.css?inline";
import style from "./style.css?inline";

const template = document.createElement("template");
template.innerHTML = `
      <style>
        ${sharedStyles}
        ${style}
      </style>

    <div class="to-do-items-wrapper">
      <div class="todo-group-item">
        <div class="img-container"></div>
        <div class="todo-group-item-wrapper">
          <div class="flex-row space-between align-center">
            <h2 class="todo-group-item-title"></h2>
            <button class="btn-three-dots"><img src="src/resources/three-dots.svg" alt="three-dots"></button>
          </div>
          <ul class="reset-ul">
          <slot name="member-list-item"></slot>

          </ul>
          <p class="date place-right">19/02-25</p>
          <progress-bar completed="50%" ></progress-bar>
        </div>
      </div>`;

export default template;