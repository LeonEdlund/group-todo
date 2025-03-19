const template = document.createElement("template");
export default template;

template.innerHTML = `
    <div class="to-do-items-wrapper">
      <div class="todo-group-item">
        <div class="img-container"></div>
        <div class="todo-group-item-wrapper">

          <div class="flex-row space-between align-center">
            <h2 class="todo-group-item-title"></h2>
            <button id="btn-three-dots"><img id="three-dots-img" alt="three-dots"></button>
          </div>

          <ul class="reset-ul" id="members">
            <slot name="member-list-item"></slot>
          </ul>

          <p class="date place-right"></p>
          <progress-bar completed="50%" ></progress-bar>
        </div>
      </div>`;
