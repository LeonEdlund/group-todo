import template from "./template";

class Home extends HTMLElement {
  constructor() {
    super();
    this.appendChild(template.content.cloneNode(true));
  }

  connectedCallback() {
    this.addEventListener("openPopup", this.openPopUp);
    this.addEventListener("closePopup", this.closePopUp);
  }

  openPopUp(event) {
    const title = document.getElementById("header-title");
    const contentContainer = document.getElementById("content-container");

    title.innerHTML = "Create<br>New Project";

    contentContainer.innerHTML = `
    <div class="todo-group-item name-input-wrapper">
      <div class="todo-group-item-wrapper">
        <div class="flex-row space-between align-center">
          <input type="text" name="group-name" id="input-group-name" placeholder="Name...">
          <button class="btn-arrow">&rightarrow;</button>
        </div>
      </div>
    </div>
    `;
  }

  closePopUp() {
    const title = document.getElementById("header-title");
    const contentContainer = document.getElementById("content-container");
    title.innerHTML = "Your<br>Projects";

    contentContainer.innerHTML = `
    <div id="content-container">
      <project-list></project-list>
    </div>
    `;

  }
}

customElements.define("home-view", Home);