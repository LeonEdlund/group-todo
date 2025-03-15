import template from "./template";
import style from "./style.css?inline";
import { addStylesheetToShadowRoot } from "../../utils/style-manipulation";
import { router } from "../../Router";
import { getData } from "../../utils/api";
import createCard from "../../utils/createCard";
import createTask from "../../utils/createTask";
import basePath from "../../utils/basePath";

class ProjectView extends HTMLElement {
  #id;
  #backBtn;
  #addBtn;
  #taskWrapper;
  #card;
  #cardWrapper;
  #form;
  #scoresModal;
  #addTaskModal
  #closeScoresBtn;
  #closeTaskBtn;
  #openScore;

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
    this.#backBtn = this.shadowRoot.getElementById("back-btn");
    this.#addBtn = this.shadowRoot.getElementById("add-task");
    this.#openScore = this.shadowRoot.getElementById("open-score");
    this.#closeScoresBtn = this.shadowRoot.getElementById("close-scores");
    this.#closeTaskBtn = this.shadowRoot.getElementById("close-task-modal");
    this.#taskWrapper = this.shadowRoot.getElementById("tasks-wrapper");
    this.#cardWrapper = this.shadowRoot.getElementById("card-wrapper");
    this.#scoresModal = this.shadowRoot.getElementById("scores-modal");
    this.#addTaskModal = this.shadowRoot.querySelector("#add-task-modal")
    this.#form = this.shadowRoot.querySelector("form-add-task");
    this.#form.setAttribute("project-id", this.#id);

    this.#addEventlisteners();

    const cardData = await getData(`${basePath}/api/project/${this.#id}`);
    const tasks = await this.#fetchTasks();
    this.#createTask(tasks);
    this.#updateCard(cardData);
  }

  bindMethods() {
    this.taskAdded = this.taskAdded.bind(this);
  }

  #addEventlisteners() {
    this.#backBtn.onclick = () => router.navigateTo("/");
    this.#addBtn.onclick = () => { this.#addTaskModal.showModal(); };
    this.#closeScoresBtn.onclick = () => { this.#scoresModal.close() }
    this.#closeTaskBtn.onclick = () => { this.#addTaskModal.close() }
    this.#taskWrapper.addEventListener("taskToggled", (e) => {
      console.log(e.detail.progress.completed);
      this.#card.setAttribute("progress", e.detail.progress.completed);
    });

    this.#openScore.onclick = async () => {
      this.#scoresModal.showModal();
      await this.loadScores();
    };

    this.#form.addEventListener("taskAdded", this.taskAdded);
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
    this.#addTaskModal.close();
    const tasks = await this.#fetchTasks();
    this.#createTask(tasks);
  }

  //--------------------------------------------------------------------------
  // LEADERBOARD
  //--------------------------------------------------------------------------

  async loadScores() {
    const scoreWrapper = this.#scoresModal.querySelector("#score-wrapper");
    const scores = await getData(`${basePath}/api/project/${this.#id}/scores`);

    if (!scores) return;

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
  // DISPOSE
  //--------------------------------------------------------------------------

  disconnectedCallback() {
    // Clear Listeners
    this.#backBtn.onclick = null;
    this.#addBtn.onclick = null;
    this.#openScore.onclick = null;
    this.#form.removeEventListener("taskAdded", this.taskAdded);

    // Clear html elements
    this.#backBtn = null;
    this.#addBtn = null;
    this.#openScore = null;
    this.#closeScoresBtn = null;
    this.#taskWrapper = null;
    this.#cardWrapper = null;
    this.#scoresModal = null;
    this.#form = null;
  }
}

customElements.define("project-view", ProjectView);