import sharedStyles from "../../styles/shared-styles.css?inline";
import style from "./style.css?inline";

const template = document.createElement("template");
template.innerHTML = `
      <style>
        ${sharedStyles}
        ${style}
      </style>

    <div id="backbar">
      <p id="back-btn">Back</p>
    </div>
    
    <project-card title="My First Group Project" created="26/02-25" progress="70%">
      <li slot="member-list-item"><i>Leon Edlund</i></li>
      <li slot="member-list-item"><i>Theo Myrvold</i></li>
      <li slot="member-list-item"><i>Jesper Milton</i></li>
      <li slot="member-list-item"><i>+2</i></li>
    </project-card>

    <div class="btn-container">
      <div class="round-decoration"></div>
      <div class="round-decoration"></div>
      <button id="add-task">+</button>
      <div class="round-decoration"></div>
      <div class="round-decoration"></div>
    </div>


    <div class="tasks">
     <task-container title="Create something" assigned="Leon Edlund"></task-container>
    </div>
    `;

export default template;

{/* <task-container title="Second thing" assigned="Theo Myrvold"></task-container> */ }