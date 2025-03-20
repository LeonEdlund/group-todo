const template = document.createElement("template");
export default template;

template.innerHTML = `      
    <div class="todo-group-item name-input-wrapper">
      <div class="todo-group-item-wrapper">
        <div class="flex-row space-between align-center">
          <input type="text" name="group-name" id="input-group-name" placeholder="Name...">
          <button class="btn-arrow">&rightarrow;</button>
        </div>
      </div>
    </div>`;

