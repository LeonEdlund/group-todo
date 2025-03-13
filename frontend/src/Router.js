import Router from "vanilla-router";
import isAuthenticated from "./utils/isAuthenticated";
import { gsap } from "gsap";

const app = document.getElementById("app");

export var router = new Router({
  mode: 'history',
  page404: function (path) {
    app.innerHTML = "<h1>page not found</h1>";
    console.log('"/' + path + '" Page not found');
  }
});

router.add('', async function () {
  const user = await isAuthenticated();

  if (!user) {
    router.navigateTo("/login");
    return;
  }

  app.innerHTML = "";
  const homeView = document.createElement("home-view");
  const navBar = document.createElement("nav-footer");
  console.log(user);
  navBar.setAttribute("profile-pic", user.profile_url);
  app.append(homeView, navBar);
});

router.add('project/(:num)', async function (id) {
  const user = await isAuthenticated();
  if (!user) {
    router.navigateTo("/login");
    return;
  }

  // get data 
  app.innerHTML = "";
  const projectView = document.createElement("project-view");
  projectView.projectId = id;
  app.appendChild(projectView);

});

router.add("login", async function () {
  const user = await isAuthenticated();

  if (user) {
    router.navigateTo("/");
    return;
  }

  app.innerHTML = "";
  const loginView = document.createElement("login-view");
  app.appendChild(loginView);
});

router.addUriListener();
router.check();


// router.navigateTo('');