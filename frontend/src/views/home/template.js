import sharedStyles from "../../styles/shared-styles.css?inline";
import style from "./style.css?inline";

const template = document.createElement("template");
template.innerHTML = `
      <style>
        ${sharedStyles}
        ${style}
      </style>

    <custom-header title="Your<br>Projects"></custom-header>

    <div id="content-container">
      <div id="project-wrapper">
        <project-list></project-list>
      </div>

      <div id="pop-up" class="hidden">
        <upload-field></upload-field>
      </div>
    </div>
    `;

export default template;