// const router = new Router({
//   "/": "/index.html",
//   "/upload": "/new-project.html"
// });

export default class Router {
  #routs;

  constructor(routs) {
    this.#routs = routs;
    document.addEventListener("nav", this.navigate);
  }

  get routs() {
    return this.#routs;
  }

  render() {

  }

  navigate(event) {

  }
}