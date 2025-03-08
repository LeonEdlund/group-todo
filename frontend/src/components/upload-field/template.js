import style from "./style.css?inline";

const template = document.createElement("template");
template.innerHTML = `
      <style>
        ${style}
      </style>
      
    <div class="todo-group-item name-input-wrapper">
      <div class="todo-group-item-wrapper">
        <div class="flex-row space-between align-center">
          <input type="text" name="group-name" id="input-group-name" placeholder="Name...">
          <button class="btn-arrow">&rightarrow;</button>
        </div>
      </div>
    </div>`;

export default template;