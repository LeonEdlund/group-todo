import template from "./template";

class ProjectList extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(template.content.cloneNode(true));
    this.#fetchData();
  }

  async #fetchData() {
    const data = await fetch("/api").then(response => response.json());
    this.#createCards(data);
  }

  #createCards(data) {
    const itemWrapper = this.shadowRoot.querySelector(".to-do-items-wrapper");

    data.forEach(project => {
      const card = document.createElement("project-card");
      card.setAttribute("title", project.title);
      card.setAttribute("created", project.created_at);
      card.setAttribute("progress", project.progress);

      const owner = document.createElement("li");
      owner.setAttribute("slot", "member-list-item");
      const wrapper = document.createElement("i");
      wrapper.innerText = project.owner;
      owner.appendChild(wrapper);
      card.appendChild(owner);

      for (let i = 0; i < project.members.length; i++) {
        const listItem = document.createElement("li");
        listItem.setAttribute("slot", "member-list-item");
        const wrapper = document.createElement("i");

        if (i < 2) {
          wrapper.innerText = project.members[i];
          listItem.appendChild(wrapper);
          card.appendChild(listItem);
        } else {
          wrapper.innerText = "+2";
          listItem.appendChild(wrapper);
          card.appendChild(listItem);
          break;
        }
      }

      itemWrapper.appendChild(card);
    });
  }
}

customElements.define("project-list", ProjectList);