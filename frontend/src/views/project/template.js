const template = document.createElement("template");
export default template;

template.innerHTML = `
    <div id="backbar">
      <p id="back-btn"><ion-icon name="chevron-back-outline" size="large"></ion-icon> Back</p>
    </div>
    
    <div id="card-wrapper">
    </div>


    <div id="btn-container">
      <button class="round-decoration" id="open-score"><ion-icon name="trophy-outline"></ion-icon></button>

      <button id="add-task">
        <ion-icon name="add-outline"></ion-icon>
      </button>

      <button class="round-decoration" id="open-share">
        <ion-icon name="person-add-outline"></ion-icon>
      </button>
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

      <div class="share-link-container">
        <input type="text" id="share-link" value="https://example.com" readonly>
      </div>
        
    </dialog>`;

// <button id="copy-share-link"><ion-icon name="copy-outline"</ion-icon></button>