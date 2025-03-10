export async function getData(path) {
  try {
    const response = await fetch(path);
    return await response.json();
  } catch (e) {
    return {};
  }
}

export async function uploadJSON(path, method, body) {
  try {
    const response = await fetch(path, {
      method: method,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body)
    });

    return await response.json();

  } catch (e) {
    console.log(e);
    return {};
  }
}