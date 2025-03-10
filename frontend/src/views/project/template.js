const template = document.createElement("template");
export default template;

template.innerHTML = `
    <div id="backbar">
      <p id="back-btn">Back</p>
    </div>
    
    <div id="card-wrapper">
    </div>


    <div class="btn-container">
      <div class="round-decoration"></div>
      <div class="round-decoration"></div>
      <button id="add-task">+</button>
      <div class="round-decoration"></div>
      <div class="round-decoration"></div>
    </div>


    <div id="tasks-wrapper">
    </div>

    <dialog>
      <form-add-task></form-add-task>
    </dialog>     
    `;

// <project-card title="My First Group Project" created="26/02-25" progress="70%">
//   <li slot="member-list-item"><i>Leon Edlund</i></li>
//   <li slot="member-list-item"><i>Theo Myrvold</i></li>
//   <li slot="member-list-item"><i>Jesper Milton</i></li>
//   <li slot="member-list-item"><i>+2</i></li>
// </project-card>