import template from "./template";
import style from "./style.css?inline";
import { addStylesheetToShadowRoot } from "../../utils/style-manipulation";
import { router } from "../../Router";
import { getData } from "../../utils/api";
import createCard from "../../utils/createCard";
import createTask from "../../utils/createTask";
import basePath from "../../utils/basePath";
import ModalHandler from "../../utils/ModalHandler";

class ProjectView extends HTMLElement {
  #id;
  #btnContainer
  #backBtn;
  #copyShareLink;
  #cardWrapper;
  #card;
  #taskWrapper;
  #form;

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(template.content.cloneNode(true));
    addStylesheetToShadowRoot(style, this.shadowRoot);
    this.bindMethods();
  }

  //--------------------------------------------------------------------------
  // GETTERS AND SETTERS
  //--------------------------------------------------------------------------

  set projectId(id) {
    this.#id = id;
  }

  //--------------------------------------------------------------------------
  // INITIALIZING
  //--------------------------------------------------------------------------

  async connectedCallback() {
    // BUTTONS
    this.#btnContainer = this.shadowRoot.getElementById("btn-container");
    this.#backBtn = this.shadowRoot.getElementById("back-btn");

    // ELEMENTS
    this.#cardWrapper = this.shadowRoot.getElementById("card-wrapper");
    this.#taskWrapper = this.shadowRoot.getElementById("tasks-wrapper");
    this.#form = this.shadowRoot.querySelector("form-add-task");
    this.#form.setAttribute("project-id", this.#id);

    this.#registerModals();
    this.#addEventlisteners();

    const cardData = await getData(`${basePath}/api/project/${this.#id}`);
    const tasks = await this.#fetchTasks();
    this.#createTask(tasks);
    this.#updateCard(cardData);
  }

  bindMethods() {
    this.taskAdded = this.taskAdded.bind(this);
    this.loadScores = this.loadScores.bind(this);
    this.shareModalInit = this.shareModalInit.bind(this);
  }

  #registerModals() {
    ModalHandler.register("score-modal", this.shadowRoot.getElementById("scores-modal"), this.loadScores);
    ModalHandler.register("add-task-modal", this.shadowRoot.getElementById("add-task-modal"));
    ModalHandler.register("share-modal", this.shadowRoot.getElementById("share-modal"), this.shareModalInit);
  }

  #addEventlisteners() {
    this.#btnContainer.addEventListener("click", this.#handleModalBtns);
    this.#backBtn.onclick = () => router.navigateTo("/");

    this.#form.addEventListener("taskAdded", this.taskAdded);
    this.#taskWrapper.addEventListener("taskToggled", (e) => {
      this.#card.setAttribute("progress", e.detail.progress.completed);
    });
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

  //--------------------------------------------------------------------------
  // CARD METHODS
  //--------------------------------------------------------------------------

  #updateCard(data) {
    if (!data) return;

    this.#card = createCard(data);
    this.#cardWrapper.appendChild(this.#card);
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
  // LEADERBOARD
  //--------------------------------------------------------------------------

  shareModalInit() {
    const linkField = this.shadowRoot.getElementById("share-link");
    const btn = this.shadowRoot.getElementById("copy-share-link");
    linkField.value = window.location + "/join";
  }

  //--------------------------------------------------------------------------
  // DISPOSE
  //--------------------------------------------------------------------------

  disconnectedCallback() {
    // Clear Listeners
    this.#backBtn.onclick = null;
    this.#btnContainer.removeEventListener("click", this.#handleModalBtns);
    this.#form.removeEventListener("taskAdded", this.taskAdded);

    // Clear html elements
    this.#taskWrapper = null;
    this.#cardWrapper = null;
    this.#form = null;

    // unregister modals
    ModalHandler.unregister("score-modal");
    ModalHandler.unregister("add-task-modal");
  }
}

customElements.define("project-view", ProjectView);