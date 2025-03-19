const template = document.createElement("template");
export default template;

template.innerHTML = `
<div id="overlay">
  <div id="wrapper">
    <h2></h2>
    <ul>
      <slot name="list-item"></slot>
    </ul>
  </div>
</div>`;
