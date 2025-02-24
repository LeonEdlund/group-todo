import sharedStyles from "../../styles/shared-styles.css?inline";
import style from "./style.css?inline";

const template = document.createElement("template");
template.innerHTML = `
      <style>
        ${sharedStyles}
        ${style}
      </style>
      
      <div id="progress-bar">
        <div id="progress-bar-indicator"></div>
      </div>`;

export default template;