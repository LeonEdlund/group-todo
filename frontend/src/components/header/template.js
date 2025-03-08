const template = document.createElement("template");
export default template;

template.innerHTML = `
  <div class="flex-row space-between align-center header" id="header">
    <h1 id="title" slot-name="title"></h1>
    <btn-big-blue></btn-big-blue>
  </div>
`;
