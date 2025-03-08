import template from "./template";
import style from "./style.css?inline";
import { addStylesheetToShadowRoot } from "../../utils/style-manipulation";
import { format, parseISO } from "date-fns";
import { router } from "../../Router";

class ProjectList extends HTMLElement {
  #itemWrapper;

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(template.content.cloneNode(true));
    addStylesheetToShadowRoot(style, this.shadowRoot);
    this.bindMethods();

    this.#itemWrapper = this.shadowRoot.querySelector(".to-do-items-wrapper");
  }

  bindMethods() {

  }

  async connectedCallback() {
    const data = await this.#fetchData();
    this.#createCards(data);
    this.#itemWrapper.addEventListener("click", this.navigateTo);
  }

  async #fetchData() {
    const data = await fetch("/api/projects").then(response => response.json());
    return data;
  }

  #createCards(data) {
    data.forEach(project => {
      const card = document.createElement("project-card");
      const createdAt = format(parseISO(project.created_at), "dd/MM-yy");
      card.setAttribute("id", project.project_id);
      card.setAttribute("title", project.title);
      card.setAttribute("created", createdAt);
      console.log(project.created_at);
      card.setAttribute("cover_img", project.img);
      card.setAttribute("progress", `${project.progress_percentage}%`);

      const owner = document.createElement("li");
      owner.setAttribute("slot", "member-list-item");
      const wrapper = document.createElement("i");

      wrapper.innerText = project.owner;
      owner.appendChild(wrapper);
      card.appendChild(owner);

      const members = JSON.parse(project.members);
      for (let i = 0; i < members.length; i++) {
        const listItem = document.createElement("li");
        listItem.setAttribute("slot", "member-list-item");
        const wrapper = document.createElement("i");

        if (i < 2) {
          wrapper.innerText = members[i].name;
          listItem.appendChild(wrapper);
          card.appendChild(listItem);
        } else {
          wrapper.innerText = "+2";
          listItem.appendChild(wrapper);
          card.appendChild(listItem);
          break;
        }
      }

      this.#itemWrapper.appendChild(card);
    });
  }

  navigateTo(event) {
    const projectCard = event.target.closest("project-card");
    if (projectCard) {
      const projectId = projectCard.getAttribute("id");
      router.navigateTo(`/project/${projectId}`);
    }
  }
}

customElements.define("project-list", ProjectList);