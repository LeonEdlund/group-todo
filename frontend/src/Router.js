import Router from "vanilla-router";
import isAuthenticated from "./utils/isAuthenticated";
import { getData } from "./utils/api";
import basePath from "./utils/basePath";
// import { gsap } from "gsap";

const app = document.getElementById("app");

//--------------------------------------------------------------------------
// INIT
//--------------------------------------------------------------------------
export const router = new Router({
  mode: 'history',
  root: '/~le223nd/webbteknik-6/to-do-app',
  page404: function (path) {
    app.innerHTML = "<h1>page not found</h1>";
    console.log('"/' + path + '" Page not found');
  }
});


//--------------------------------------------------------------------------
// HOME
//--------------------------------------------------------------------------
router.add('', async function () {
  const user = await isAuthenticated();

  if (!user) {
    router.navigateTo("/login");
    return;
  }

  const homeView = document.createElement("home-view");
  const loggedInUser = document.createElement("nav-footer");
  loggedInUser.setAttribute("profile-pic", user.profile_url);

  app.innerHTML = "";
  app.append(homeView, loggedInUser);
});


//--------------------------------------------------------------------------
// PROJECT
//--------------------------------------------------------------------------
router.add('project/(:num)', async function (id) {
  app.innerHTML = "<h3>Loading...</h3>";

  const user = await isAuthenticated();
  if (!user) {
    router.navigateTo("/login");
    return;
  }

  const cardData = await getData(`${basePath}/api/project/${id}`);

  if (!cardData) {
    router.navigateTo("/");
    return;
  };

  const tasks = await getData(`${basePath}/api/project/${id}/tasks`);

  const projectView = document.createElement("project-view");
  projectView.projectId = id;
  projectView.project = cardData;
  projectView.tasks = tasks;

  app.innerHTML = "";
  app.appendChild(projectView);
});


//--------------------------------------------------------------------------
// JOIN 
//--------------------------------------------------------------------------
router.add('project/(:num)/join', async function (id) {
  window.location.href = `${window.location.origin}${basePath}/api/project/${id}/join`;
});


//--------------------------------------------------------------------------
// LOG IN
//--------------------------------------------------------------------------
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


//--------------------------------------------------------------------------
// RUN
//--------------------------------------------------------------------------
router.addUriListener();
router.check();