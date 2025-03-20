import template from "./template";
import style from "./style.css?inline";
import { addStylesheetToShadowRoot } from "../../utils/style-manipulation";
import { router } from "../../Router";
import { getData } from "../../utils/api";
import createCard from "../../utils/createCard";
import basePath from "../../utils/basePath";

class Home extends HTMLElement {
  #itemWrapper;
  #projects;

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(template.content.cloneNode(true));
    addStylesheetToShadowRoot(style, this.shadowRoot);
    this.#bindMethods();

    this.#itemWrapper = this.shadowRoot.querySelector("#project-wrapper");
    this.#projects = [];
  }

  #bindMethods() {
    this.openPopUp = this.openPopUp.bind(this);
    this.closePopUp = this.closePopUp.bind(this);
    this.openEditMenu = this.openEditMenu.bind(this);
  }

  connectedCallback() {
    this.#itemWrapper.innerHTML = `<small-loader class="center"></h3>`;
    this.#addEventlisteners();
    this.#fetchData();
    // this.#itemWrapper.addEventListener("click", this.navigateTo);
  }

  disconnectedCallback() {
    document.removeEventListener("card:card-clicked", this.navigateTo);
    document.removeEventListener("card:menu-clicked", this.openEditMenu);
    this.removeEventListener("button-toggled", this.openPopUp);
    this.removeEventListener("button-untoggled", this.closePopUp);
    this.#allowScroll(true);
  }

  #addEventlisteners() {
    document.addEventListener("card:card-clicked", this.navigateTo);
    document.addEventListener("card:menu-clicked", this.openEditMenu);
    this.addEventListener("button-toggled", this.openPopUp);
    this.addEventListener("button-untoggled", this.closePopUp);
  }

  openPopUp() {
    this.#updateHeaderTitle("Create<br>New Project");
    this.shadowRoot.querySelector("#pop-up").classList.remove("hidden");
    this.#allowScroll(false);
  }

  closePopUp() {
    this.#updateHeaderTitle("Your<br>Projects");
    this.shadowRoot.querySelector("#pop-up").classList.add("hidden");
    this.#allowScroll(true);
  }

  #updateHeaderTitle(title) {
    this.shadowRoot.querySelector("custom-header").setAttribute("title", title);
  }

  #allowScroll(allowed) {
    if (allowed) {
      document.documentElement.style.overflow = "scroll";
      document.body.style.overflowY = "scroll";
    } else if (!allowed) {
      document.documentElement.style.overflow = "hidden";
      document.body.style.overflowY = "hidden";
    }
  }

  async #fetchData() {
    try {
      const projects = await getData(`${basePath}/api/projects`);
      this.#projects = projects;
      this.#createCards();
    } catch (e) {
      console.log(e);
      this.#itemWrapper.innerHTML = "<h3>Something went wrong...</h3>";
    }
  }

  #createCards() {
    if (!this.#projects) {
      this.#itemWrapper.innerHTML = "<p>No projects</p>";
      return;
    }

    const cards = this.#projects.map(card => createCard(card));

    this.#itemWrapper.innerHTML = "";
    this.#itemWrapper.append(...cards);
  }

  navigateTo(event) {
    const id = event.detail.id;
    if (id) {
      router.navigateTo(`/project/${id}`);
    }
  }

  openEditMenu(event) {
    const projectId = event.detail.id;
    console.log(projectId);
    const menu = document.createElement("custom-menu");
    if (!projectId) return;

    menu.projectId = projectId;
    this.shadowRoot.appendChild(menu);
  }
}

customElements.define("home-view", Home);