const fetchData = async (url) => {
  const data = await fetch(url);
  const response = await data.text();
  console.log(response);
  document.getElementById("app").innerHTML = response;
}

fetchData("/view/projects.html");