const template = document.createElement("template");
export default template;

template.innerHTML = `
    <custom-header title="Your<br>Projects"></custom-header>

    <div id="content-container">
      <div id="project-wrapper">
        <project-list></project-list>
      </div>

      <div id="pop-up" class="hidden">
        <upload-field></upload-field>
      </div>
    </div>
    `;
