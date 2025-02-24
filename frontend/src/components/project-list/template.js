import sharedStyles from "../../styles/shared-styles.css?inline";
import style from "./style.css?inline";

const template = document.createElement("template");
template.innerHTML = `
      <style>
        ${sharedStyles}
        ${style}
        
        .to-do-items-wrapper {
          display:flex;
          flex-direction: column;
          gap: 1.2rem;
        }
      </style>
      
      <div class="to-do-items-wrapper"></div>
      `;

export default template;