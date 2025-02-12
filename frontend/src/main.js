import { SvgGenerator } from "./classes/SvgGenerator";

// const fetchData = async (url) => {
//   const data = await fetch(url);
//   const response = await data.text();
//   console.log(response);
//   document.getElementById("app").innerHTML = response;
// }

// fetchData("/view/projects.html");


const svgGenerator = new SvgGenerator();
let toDoItems = document.querySelectorAll(".todo-group-item .img-container");
toDoItems.forEach(item => {
  item.appendChild(svgGenerator.generateSvg());
});
svgGenerator.generateSvg();


