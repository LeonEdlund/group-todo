import sharedStyles from "../../styles/shared-styles.css?inline";

const template = document.createElement("template");
template.innerHTML = `
      <style>
        ${sharedStyles}
          .header {
            margin-top: 2rem;
            margin-bottom: 1rem;
            overflow: hidden;
          }

        .move-left {
          transform: transformX(-300px);
          transition: transformX 0.3s;
        }

       .move-right {
          transform: transformX(0px);
          transition: transformX 0.3s;
        }
      </style>

    <div class="flex-row space-between align-center header">
        <h1 id="header-title">Your<br>Projects</h1>
        <btn-big-blue></btn-big-blue>
    </div>

    <div id="content-container">
    
      <upload-field></upload-field>
      
    </div>
    `;

export default template;

{/* <project-list></project-list> */ }