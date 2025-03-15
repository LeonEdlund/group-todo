const template = document.createElement("template");
export default template;

template.innerHTML = `
    <div id="backbar">
      <p id="back-btn">Back</p>
    </div>
    
    <div id="card-wrapper">
    </div>


    <div class="btn-container">
      <button class="round-decoration" id="open-score"><ion-icon name="trophy-outline"></ion-icon></button>
      <button id="add-task"><ion-icon name="add-outline"></ion-icon></button>
      <div class="round-decoration" id="share"><ion-icon name="person-add-outline"></ion-icon></ion-icon></div>
    </div>


    <div id="tasks-wrapper">
    </div>

    <dialog id="add-task-modal">
      <div class="header">
        <h2>Create Task</h2>
        <button class="closeBtn" data-set-close>X</button>
      </div>
      <form-add-task></form-add-task>
    </dialog>
    
    <dialog id="scores-modal">
      <div class="header">
        <h2>Scoreboard</h2>
        <button class="closeBtn" data-set-close>X</button>
      </div>

      <div id="score-wrapper"></div>
    </dialog>

    <dialog id="share-modal">
      <div class="header">
        <h2>Share</h2>
        <button class="closeBtn" data-set-close>X</button>
      </div>

      <div id="score-wrapper"></div>
    </dialog>
    `;