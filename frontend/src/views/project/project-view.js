import template from "./template";
import style from "./style.css?inline";
import { addStylesheetToShadowRoot } from "../../utils/style-manipulation";
import { router } from "../../Router";
import { getData } from "../../utils/api";
import createCard from "../../utils/createCard";
import createTask from "../../utils/createTask";
import basePath from "../../utils/basePath";
import ModalHandler from "../../Handlers/ModalHandler";

class ProjectView extends HTMLElement {
  #id;
  #btnContainer
  #backBtn;
  #cardWrapper;
  #card;
  #taskWrapper;
  #form;

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(template.content.cloneNode(true));
    addStylesheetToShadowRoot(style, this.shadowRoot);
    this.#bindMethods();

    // BUTTONS
    this.#btnContainer = this.shadowRoot.getElementById("btn-container");
    this.#backBtn = this.shadowRoot.getElementById("back-btn");

    // ELEMENTS
    this.#cardWrapper = this.shadowRoot.getElementById("card-wrapper");
    this.#taskWrapper = this.shadowRoot.getElementById("tasks-wrapper");
    this.#form = this.shadowRoot.querySelector("form-add-task");
    this.#card = null;
  }

  //--------------------------------------------------------------------------
  // GETTERS AND SETTERS
  //--------------------------------------------------------------------------

  set projectId(id) {
    this.#id = id;
  }

  set project(project) {
    this.#updateCard(project);
  }

  set tasks(tasks) {
    this.#createTask(tasks);
  }

  //--------------------------------------------------------------------------
  // INITIALIZING
  //--------------------------------------------------------------------------

  async connectedCallback() {
    this.#form.setAttribute("project-id", this.#id);
    this.#registerModals();
    this.#addEventlisteners();
  }

  #bindMethods() {
    this.taskAdded = this.taskAdded.bind(this);
    this.updateCardProgress = this.updateCardProgress.bind(this);
    this.loadScores = this.loadScores.bind(this);
    this.shareModalInit = this.shareModalInit.bind(this);
    this.openMenu = this.openMenu.bind(this);
  }

  #registerModals() {
    ModalHandler.register("add-task-modal", this.shadowRoot.getElementById("add-task-modal"));
    ModalHandler.register("score-modal", this.shadowRoot.getElementById("scores-modal"), this.loadScores);
    ModalHandler.register("share-modal", this.shadowRoot.getElementById("share-modal"), this.shareModalInit);
  }

  #addEventlisteners() {
    this.#btnContainer.addEventListener("click", this.#handleModalBtns);
    this.#backBtn.onclick = () => router.navigateTo("/");

    this.#form.addEventListener("taskAdded", this.taskAdded);
    this.#taskWrapper.addEventListener("taskToggled", this.updateCardProgress);
    this.#card.addEventListener("card:menu-clicked", this.openMenu);
  }

  #handleModalBtns(event) {
    const pressedBtn = event.target.closest("button");
    if (!pressedBtn) return;

    const btnId = pressedBtn.id;

    const cases = {
      "open-score": () => ModalHandler.open("score-modal"),
      "add-task": () => ModalHandler.open("add-task-modal"),
      "open-share": () => ModalHandler.open("share-modal"),
    }

    const btnCase = cases[btnId];

    if (btnCase) btnCase();
  }

  disconnectedCallback() {
    // Clear Listeners
    this.#form.removeEventListener("taskAdded", this.taskAdded);
    this.#taskWrapper.removeEventListener("taskToggled", this.updateCardProgress);
    this.#btnContainer.removeEventListener("click", this.#handleModalBtns);
    this.#backBtn.onclick = null;

    // Clear html elements
    this.#taskWrapper = null;
    this.#cardWrapper = null;
    this.#form = null;

    // unregister modals
    ModalHandler.unregister("score-modal");
    ModalHandler.unregister("add-task-modal");
    ModalHandler.unregister("share-modal");
  }

  //--------------------------------------------------------------------------
  // CARD METHODS
  //--------------------------------------------------------------------------

  #updateCard(data) {
    if (!data) return;
    this.#card = createCard(data);
    this.#cardWrapper.appendChild(this.#card);
  }

  updateCardProgress(event) {
    this.#card.setAttribute("progress", event.detail.progress);
  }

  //--------------------------------------------------------------------------
  // TASK METHODS
  //--------------------------------------------------------------------------

  async #fetchTasks() {
    this.#taskWrapper.innerHTML = "Loading...";
    return await getData(`${basePath}/api/project/${this.#id}/tasks`);
  }

  #createTask(tasks) {
    if (!tasks.length) {
      this.#taskWrapper.innerHTML = "<p>No tasks...</p>";
      return;
    }

    const taskElems = tasks.map(task => createTask(this.#id, task));

    this.#taskWrapper.innerHTML = "";
    this.#taskWrapper.append(...taskElems);
  }

  async taskAdded() {
    ModalHandler.close("add-task-modal");
    const tasks = await this.#fetchTasks();
    this.#createTask(tasks);
  }

  //--------------------------------------------------------------------------
  // LEADERBOARD
  //--------------------------------------------------------------------------

  async loadScores() {
    const scoreWrapper = this.shadowRoot.querySelector("#score-wrapper");
    const scores = await getData(`${basePath}/api/project/${this.#id}/scores`);
    scoreWrapper.innerHTML = "<p>Loading...</p>";

    if (!scores) { scoreWrapper.innerHTML = "<p>No Scores</p>"; return; };

    const scoresElements = scores.map(score => {
      const scoreCard = document.createElement("user-score-card");
      scoreCard.setAttribute("display-name", score.display_name);
      scoreCard.setAttribute("score", score.total_score);
      scoreCard.setAttribute("profile-pic", score.profile_url);
      return scoreCard;
    });

    scoreWrapper.innerHTML = "";
    scoreWrapper.append(...scoresElements);
  }

  //--------------------------------------------------------------------------
  // SHARE MODAL
  //--------------------------------------------------------------------------

  shareModalInit() {
    const linkField = this.shadowRoot.getElementById("share-link");
    linkField.value = window.location + "/join";
  }

  //--------------------------------------------------------------------------
  // MENU
  //--------------------------------------------------------------------------

  openMenu() {
    const menu = document.createElement("custom-menu");
    menu.projectId = this.#id;
    this.shadowRoot.appendChild(menu);
  }
}

customElements.define("project-view", ProjectView);