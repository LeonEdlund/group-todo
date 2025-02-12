const fetchData = async () => {
  const data = await fetch("/view");
  const response = await data.text();
  console.log(response);
  document.getElementById("app").innerHTML = response;
}

fetchData();