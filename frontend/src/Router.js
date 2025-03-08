import Router from "vanilla-router";
import { gsap } from "gsap";

const app = document.getElementById("app");
const secondScreen = document.getElementById("second-screen");

export var router = new Router({
  mode: 'history',
  page404: function (path) {
    app.innerHTML = "<h1>page not found</h1>";
    console.log('"/' + path + '" Page not found');
  }
});

router.add('', function () {
  app.innerHTML = "";
  const homeView = document.createElement("home-view");
  app.appendChild(homeView);
});

router.add('project/(:num)', function (id) {
  app.innerHTML = "";
  const projectView = document.createElement("project-view");
  projectView.setAttribute("id", id);
  app.appendChild(projectView);
});

router.add('project/(:num)/add-task', function (id) {
  app.innerHTML = "";
  const formAddTask = document.createElement("form-add-task");
  formAddTask.setAttribute("project-Id", id);
  app.appendChild(formAddTask);
});

router.addUriListener();
router.check();


// router.navigateTo('');