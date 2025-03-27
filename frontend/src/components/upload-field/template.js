const template = document.createElement("template");
export default template;

template.innerHTML = `      
    <div class="name-input-wrapper flex-row space-between">
      <input type="text" name="group-name" id="input-group-name" placeholder="Name...">
      <button class="btn-arrow">&rightarrow;</button>
    </div>`;

