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
  app.appendChild(projectView);
});

router.add("login", function () {
  app.innerHTML = "";
  const loginView = document.createElement("login-view");
  app.appendChild(loginView);
});

router.addUriListener();
router.check();


// router.navigateTo('');