const template = document.createElement("template");
export default template;

template.innerHTML = `
<form>
  <input type="text" name="title" placeholder="Title...">
  <textarea type="text" name="description" rows="8" placeholder="Description..."></textarea>

  <select name="score" id="score">
    <option disabled selected>Score</option>
    <option value="100">100</option>
    <option value="200">200</option>
    <option value="300">300</option>
    <option value="400">400</option>
    <option value="500">500</option>
  </select>

  <button type="modal" id="submit">ADD</button>
</form>`;
