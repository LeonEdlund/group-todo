import "./register-components.js"
// import Router from "./Router"

fetch("/api")
  .then(response => response.json())
  .then(data => { console.log(data) });

document.getElementById("app").innerHTML = "<home-view></home-view>"