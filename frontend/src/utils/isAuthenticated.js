import basePath from "../utils/basePath";

export default async function isAuthenticated() {
  try {
    const response = await fetch(`${basePath}/api/userinfo`);
    if (response.status === 401) {
      return false;
    }
    return await response.json();
  } catch (e) {
    console.log("somethig went wrong fetching userdata: ", e);
  }
}