const template = document.createElement("template");
export default template;

template.innerHTML = `
<div id="overlay">
  <div id="wrapper">
    <h2>Edit</h2>
    <ul>
      <li slot="list-item" id="delete">
        <ion-icon name="close-circle-outline" size="large"></ion-icon>
        <h3>Delete</h3>
    </li>
    </ul >
  </div >
</div > `;
